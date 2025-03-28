export function convertToISO(dateValue: string) : Date{
    const [month, day, year] = dateValue.split('/').map(Number);
    const value = new Date(Date.UTC(year, month - 1, day));
    console.log(value);
    return value;
}