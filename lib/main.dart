import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:webview_flutter/webview_flutter.dart';

import 'ad_ids.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  unawaited(MobileAds.instance.initialize());
  await SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    systemNavigationBarColor: Color(0xFFFFF8EC),
  ));
  runApp(const CartoonCityApp());
}

class CartoonCityApp extends StatelessWidget {
  const CartoonCityApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cartoon City',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF8E5CFF),
      ),
      home: const GameScreen(),
    );
  }
}

/// Tela única: o jogo roda numa WebView carregada dos assets do app.
/// O jogo conversa com o app pelo canal JavaScript `CCNative`:
///   ready          → o app devolve o save guardado (window.__ccRestore)
///   save:<json>    → o app grava o progresso no aparelho
///   vib:<ms>       → vibração nativa
///   copy:<texto>   → copia para a área de transferência
///
/// Atualização automática do jogo: ao abrir, o app confere se existe uma versão
/// nova do jogo no GitHub (assets/game/version.txt). Se existir, baixa e oferece
/// para aplicar; na próxima abertura ela já entra sozinha. Não precisa reinstalar.
class GameScreen extends StatefulWidget {
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> with WidgetsBindingObserver {
  static const _saveKey = 'cartoon_city_save_v1';
  static const _remoteBase =
      'https://raw.githubusercontent.com/Latazin/Latazin/cartoon-city-app/assets/game/';
  static const _baseUrl = 'https://app.cartooncity.local/';

  int _gameVersion = 0;
  String? _pendingHtml;
  int _pendingVersion = 0;

  late final WebViewController _web;
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();
  bool _loading = true;
  DateTime _lastVib = DateTime.fromMillisecondsSinceEpoch(0);

  RewardedAd? _adBoost;
  RewardedAd? _adChest;

  void _loadAd(String kind) {
    final unitId = kind == 'boost' ? AdIds.rewardedBoost : AdIds.rewardedChest;
    RewardedAd.load(
      adUnitId: unitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) {
          if (kind == 'boost') {
            _adBoost = ad;
          } else {
            _adChest = ad;
          }
        },
        onAdFailedToLoad: (_) {
          // sem internet ou sem anúncio disponível agora; tenta de novo mais tarde
          Future.delayed(const Duration(seconds: 30), () {
            if (mounted) _loadAd(kind);
          });
        },
      ),
    );
  }

  void _showAd(String kind) {
    final ad = kind == 'boost' ? _adBoost : _adChest;
    if (ad == null) {
      _web.runJavaScript("window.__ccAdFail && window.__ccAdFail('$kind');");
      _loadAd(kind);
      return;
    }
    ad.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (a) {
        a.dispose();
        _loadAd(kind);
      },
      onAdFailedToShowFullScreenContent: (a, _) {
        a.dispose();
        _loadAd(kind);
        _web.runJavaScript("window.__ccAdFail && window.__ccAdFail('$kind');");
      },
    );
    ad.show(onUserEarnedReward: (_, __) {
      _web.runJavaScript("window.__ccAdReward && window.__ccAdReward('$kind');");
    });
    if (kind == 'boost') {
      _adBoost = null;
    } else {
      _adChest = null;
    }
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _loadAd('boost');
    _loadAd('chest');
    _web = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF79CFFF))
      ..enableZoom(false)
      ..addJavaScriptChannel('CCNative', onMessageReceived: _onMessage)
      ..setNavigationDelegate(NavigationDelegate(
        onPageFinished: (_) {
          // pequeno atraso para o primeiro quadro da cidade aparecer
          Future.delayed(const Duration(milliseconds: 350), () {
            if (mounted) setState(() => _loading = false);
          });
        },
        onNavigationRequest: (req) {
          final u = req.url;
          final local = u.startsWith(_baseUrl) ||
              u.startsWith('file:') ||
              u.startsWith('about:') ||
              u.startsWith('data:');
          return local ? NavigationDecision.navigate : NavigationDecision.prevent;
        },
      ));
    _bootGame();
  }

  Future<File> _cacheFile(String name) async {
    final dir = await getApplicationSupportDirectory();
    return File('${dir.path}/$name');
  }

  /// Carrega o jogo: a versão baixada (se for mais nova) ou a que veio no APK.
  Future<void> _bootGame() async {
    final bundledVersion =
        int.tryParse((await rootBundle.loadString('assets/game/version.txt')).trim()) ?? 0;
    var html = await rootBundle.loadString('assets/game/index.html');
    _gameVersion = bundledVersion;
    try {
      final f = await _cacheFile('game_index.html');
      final vf = await _cacheFile('game_version.txt');
      if (await f.exists() && await vf.exists()) {
        final v = int.tryParse((await vf.readAsString()).trim()) ?? 0;
        if (v > bundledVersion) {
          html = await f.readAsString();
          _gameVersion = v;
        }
      }
    } catch (_) {}
    await _web.loadHtmlString(html, baseUrl: _baseUrl);
    Future.delayed(const Duration(seconds: 4), _checkForUpdate);
  }

  Future<String> _download(String url) async {
    final client = HttpClient()..connectionTimeout = const Duration(seconds: 8);
    try {
      final req = await client.getUrl(Uri.parse(url));
      final res = await req.close().timeout(const Duration(seconds: 30));
      if (res.statusCode != 200) throw HttpException('HTTP ${res.statusCode}');
      return await res.transform(utf8.decoder).join();
    } finally {
      client.close();
    }
  }

  Future<void> _checkForUpdate() async {
    try {
      final t = DateTime.now().millisecondsSinceEpoch;
      final remote = int.tryParse(
              (await _download('${_remoteBase}version.txt?t=$t')).trim()) ??
          0;
      if (remote <= _gameVersion) return;
      final html = await _download('${_remoteBase}index.html?t=$t');
      if (html.length < 100000 || !html.contains('__ccRestore')) return;
      await (await _cacheFile('game_index.html')).writeAsString(html);
      await (await _cacheFile('game_version.txt')).writeAsString('$remote');
      _pendingHtml = html;
      _pendingVersion = remote;
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: const Text('Atualização do jogo baixada!'),
        duration: const Duration(seconds: 12),
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(label: 'ATUALIZAR', onPressed: _applyUpdate),
      ));
    } catch (_) {
      // sem internet: tenta de novo na próxima abertura
    }
  }

  Future<void> _applyUpdate() async {
    final html = _pendingHtml;
    if (html == null) return;
    await _web.runJavaScript('window.__ccSave && window.__ccSave();');
    await Future.delayed(const Duration(milliseconds: 700));
    if (mounted) setState(() => _loading = true);
    _gameVersion = _pendingVersion;
    _pendingHtml = null;
    await _web.loadHtmlString(html, baseUrl: _baseUrl);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _adBoost?.dispose();
    _adChest?.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive ||
        state == AppLifecycleState.detached) {
      _web.runJavaScript('window.__ccSave && window.__ccSave();');
    }
    if (state == AppLifecycleState.resumed) {
      SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
      _web.runJavaScript('window.__ccResume && window.__ccResume();');
    }
  }

  Future<void> _onMessage(JavaScriptMessage msg) async {
    final m = msg.message;
    if (m == 'ready') {
      final prefs = await _prefs;
      final saved = prefs.getString(_saveKey);
      await _web.runJavaScript('window.__ccRestore(${jsonEncode(saved)});');
    } else if (m.startsWith('save:')) {
      final prefs = await _prefs;
      await prefs.setString(_saveKey, m.substring(5));
    } else if (m.startsWith('vib:')) {
      final now = DateTime.now();
      if (now.difference(_lastVib).inMilliseconds < 40) return;
      _lastVib = now;
      final ms = int.tryParse(m.substring(4)) ?? 10;
      if (ms >= 50) {
        HapticFeedback.heavyImpact();
      } else if (ms >= 20) {
        HapticFeedback.mediumImpact();
      } else {
        HapticFeedback.lightImpact();
      }
    } else if (m.startsWith('copy:')) {
      await Clipboard.setData(ClipboardData(text: m.substring(5)));
    } else if (m == 'ad:boost' || m == 'ad:chest') {
      _showAd(m.substring(3));
    }
  }

  /// Botão voltar do Android: fecha painéis do jogo antes de perguntar se quer sair.
  Future<void> _handleBack() async {
    try {
      final r = await _web.runJavaScriptReturningResult(
          'window.__ccBack ? window.__ccBack() : "none"');
      if (r.toString().contains('handled')) return;
    } catch (_) {}
    if (!mounted) return;
    final sair = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Sair do jogo?'),
        content: const Text('Seu progresso fica salvo e a cidade continua rendendo enquanto você estiver fora.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Continuar jogando')),
          FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Sair')),
        ],
      ),
    );
    if (sair == true) {
      await _web.runJavaScript('window.__ccSave && window.__ccSave();');
      await Future.delayed(const Duration(milliseconds: 200));
      SystemNavigator.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _handleBack();
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF79CFFF),
        body: Stack(
          children: [
            Positioned.fill(child: WebViewWidget(controller: _web)),
            IgnorePointer(
              ignoring: !_loading,
              child: AnimatedOpacity(
                opacity: _loading ? 1 : 0,
                duration: const Duration(milliseconds: 450),
                child: const _Splash(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Splash extends StatefulWidget {
  const _Splash();
  @override
  State<_Splash> createState() => _SplashState();
}

class _SplashState extends State<_Splash> with SingleTickerProviderStateMixin {
  late final AnimationController _c;
  @override
  void initState() {
    super.initState();
    _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1400))..repeat();
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const ink = Color(0xFF2B2350);
    TextStyle title(double size, Color c) => TextStyle(
          fontFamily: 'Lilita',
          fontSize: size,
          color: c,
          height: 1,
          shadows: const [
            Shadow(color: ink, offset: Offset(0, 4)),
            Shadow(color: ink, offset: Offset(2, 0)),
            Shadow(color: ink, offset: Offset(-2, 0)),
            Shadow(color: ink, offset: Offset(0, -2)),
          ],
        );
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF6FC8FF), Color(0xFFBFE9FF), Color(0xFFFFE9C4)],
        ),
      ),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TweenAnimationBuilder<double>(
              tween: Tween(begin: 0.4, end: 1),
              duration: const Duration(milliseconds: 650),
              curve: Curves.elasticOut,
              builder: (ctx, v, child) => Transform.scale(scale: v, child: child),
              child: AnimatedBuilder(
                animation: _c,
                builder: (ctx, child) {
                  final bob = math.sin(_c.value * 2 * math.pi) * 6;
                  return Transform.translate(offset: Offset(0, bob), child: child);
                },
                child: Image.asset('assets/icon/icon_foreground.png', width: 156, height: 156),
              ),
            ),
            const SizedBox(height: 10),
            Text('Cartoon City', style: title(44, Colors.white)),
            const SizedBox(height: 6),
            Text('IDLE EMPIRE', style: title(19, const Color(0xFFFFD23F))),
            const SizedBox(height: 30),
            AnimatedBuilder(
              animation: _c,
              builder: (ctx, _) {
                return Row(
                  mainAxisSize: MainAxisSize.min,
                  children: List.generate(3, (i) {
                    final t = (_c.value - i * 0.18) % 1.0;
                    final s = 0.55 + 0.45 * (0.5 + 0.5 * math.sin(t * 2 * math.pi));
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 5),
                      child: Transform.scale(
                        scale: s,
                        child: Container(
                          width: 12,
                          height: 12,
                          decoration: const BoxDecoration(color: Color(0xFF8E5CFF), shape: BoxShape.circle),
                        ),
                      ),
                    );
                  }),
                );
              },
            ),
            const SizedBox(height: 10),
            Text('Carregando a cidade…',
                style: TextStyle(fontWeight: FontWeight.w800, color: ink.withOpacity(.7), fontSize: 12.5)),
          ],
        ),
      ),
    );
  }
}
