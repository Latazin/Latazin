# Cartoon City: Idle Empire — app Flutter

App Flutter para Android e iOS. O jogo completo (versão 2.0) roda dentro do app, funciona offline e salva o progresso no aparelho.

## Como rodar

Você precisa do Flutter 3.24 ou mais novo instalado (`flutter doctor` deve ficar sem erros).

```bash
cd cartoon_city_flutter

# 1. gera as pastas android/ e ios/ (não sobrescreve lib/, pubspec nem assets)
flutter create . --org com.seunome --project-name cartoon_city --platforms android,ios

# 2. baixa as dependências
flutter pub get

# 3. gera o ícone do app
dart run flutter_launcher_icons

# 4. roda num celular ou emulador conectado
flutter run
```

Troque `com.seunome` pelo identificador que você vai usar na loja (ex.: `com.cibien`). Ele não pode mudar depois da publicação.

### Nome que aparece no celular

Depois do passo 1, ajuste o nome exibido:

- **Android:** em `android/app/src/main/AndroidManifest.xml`, troque `android:label="cartoon_city"` por `android:label="Cartoon City"`.
- **iOS:** em `ios/Runner/Info.plist`, troque o valor de `CFBundleDisplayName` para `Cartoon City`.

### Gerar para publicar

```bash
flutter build appbundle --release   # Google Play (.aab)
flutter build apk --release         # APK para instalar direto
flutter build ipa --release         # App Store (precisa de Mac com Xcode)
```

Para a Google Play, configure a assinatura do app antes. Siga o guia oficial: https://docs.flutter.dev/deployment/android

## Como funciona

- `lib/main.dart`: tela única com uma WebView em tela cheia, a tela de abertura e a ponte com o celular.
- `assets/game/index.html`: o jogo inteiro, com as fontes em `assets/game/fonts/`. Não precisa de internet.
- O jogo conversa com o app pelo canal `CCNative`:
  - **Salvamento:** o progresso vai para o armazenamento do aparelho (shared_preferences). Ao fechar ou minimizar o app, ele salva na hora.
  - **Vibração:** a vibração nativa funciona no Android e no iOS.
  - **Copiar:** "Copiar código" nas Configurações usa a área de transferência do celular.
  - **Botão voltar (Android):** fecha o painel ou janela aberta. Na tela principal, pergunta se quer sair.
  - **Renda offline:** a renda acumulada enquanto o app esteve fechado é calculada ao reabrir.

## Editar o jogo

O código do jogo fica em `game_src/`:

| Arquivo | O que tem |
|---|---|
| `p1.html` | aparência (CSS) e estrutura da interface |
| `p2.js` | dados: prédios, bairros, pesquisas, projetos, personagens |
| `p3.js` | desenho de todos os prédios |
| `p4.js` | estado, simulação da cidade, salvamento |
| `p5.js` | personagens, eventos e painéis |
| `p6.js` | câmera, mapa, carros, render e inicialização |

Depois de editar, gere o HTML do app de novo e rode:

```bash
./build_game.sh
flutter run
```
