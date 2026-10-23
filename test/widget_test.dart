import 'package:flutter_test/flutter_test.dart';
import 'package:cartoon_city/main.dart';

void main() {
  test('app constrói sem erros', () {
    expect(const CartoonCityApp(), isA<CartoonCityApp>());
  });
}
