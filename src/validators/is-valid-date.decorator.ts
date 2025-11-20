import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          // Debe tener formato YYYY-MM-DD
          const regex = /^\d{4}-\d{2}-\d{2}$/;
          if (!regex.test(value)) return false;

          // Verificación de fecha real
          const [year, month, day] = value.split('-').map(Number);

          // Mes válido
          if (month < 1 || month > 12) return false;

          // Día válido para el mes
          const lastDay = new Date(year, month, 0).getDate(); 
          return day >= 1 && day <= lastDay;
        },
        defaultMessage() {
          return 'La fecha debe ser una fecha válida con formato YYYY-MM-DD.';
        },
      },
    });
  };
}
