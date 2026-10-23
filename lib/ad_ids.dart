// ============================================================
// IDs do Google AdMob — é só trocar aqui quando tiver a sua conta.
//
// Como conseguir os seus IDs:
//  1. Crie uma conta em https://admob.google.com (é grátis).
//  2. Cadastre o app "Cartoon City" (Android).
//  3. Em "ID do app", copie o valor e cole em [admobAppId] abaixo.
//  4. Crie DOIS blocos de anúncio do tipo "Recompensado":
//       - um para o Turbo 2×  → cole em [rewardedBoost]
//       - um para o Baú bônus → cole em [rewardedChest]
//  5. Salve este arquivo e peça para gerar um novo APK (ou mande
//     os 3 valores que eu troco e já deixo pronto pra você).
//
// Enquanto você não troca, o jogo usa os IDs de TESTE oficiais do
// Google: os anúncios aparecem normalmente (pra testar que tudo
// funciona), mas são de mentira e não rendem dinheiro nenhum.
// NUNCA publique o app com os IDs de teste — o Google exige os
// seus próprios IDs reais para pagar.
// ============================================================
class AdIds {
  static const String admobAppId = 'ca-app-pub-4705801610677571~7249815840';
  static const String rewardedBoost = 'ca-app-pub-4705801610677571/2638945002';
  static const String rewardedChest = 'ca-app-pub-4705801610677571/4590320926';
  static const String rewardedCar = 'ca-app-pub-4705801610677571/6922724810';

  static bool get isTest => admobAppId.contains('3940256099942544');
}
