import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:webview_flutter/webview_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
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
class GameScreen extends StatefulWidget {
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> with WidgetsBindingObserver {
  static const _saveKey = 'cartoon_city_save_v1';

  late final WebViewController _web;
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();
  bool _loading = true;
  DateTime _lastVib = DateTime.fromMillisecondsSinceEpoch(0);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
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
          final local = u.startsWith('file:') || u.startsWith('about:') || u.startsWith('data:');
          return local ? NavigationDecision.navigate : NavigationDecision.prevent;
        },
      ))
      ..loadFlutterAsset('assets/game/index.html');
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
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

class _Splash extends StatelessWidget {
  const _Splash();

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
            Image.asset('assets/icon/icon_foreground.png', width: 150, height: 150),
            const SizedBox(height: 12),
            Text('Cartoon City', style: title(46, Colors.white)),
            const SizedBox(height: 8),
            Text('IDLE EMPIRE', style: title(20, const Color(0xFFFFD23F))),
            const SizedBox(height: 28),
            const SizedBox(
              width: 34,
              height: 34,
              child: CircularProgressIndicator(strokeWidth: 4, color: Color(0xFF8E5CFF)),
            ),
          ],
        ),
      ),
    );
  }
}
