// Подготовка к интеграции с GetCourse. Сетевых вызовов нет: адреса и форматы API не придуманы.
// Оплата и доступы остаются в GetCourse. Здесь только проверка, заданы ли параметры.
export function getcourseStatus() {
  const need = ['GETCOURSE_ACCOUNT', 'GETCOURSE_API_KEY'];
  const missing = need.filter((k) => !process.env[k]);
  return { configured: missing.length === 0, missing };
}
