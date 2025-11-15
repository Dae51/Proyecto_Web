// validation.js - Validaciones de todos los tipos de datos para el servicio
export const Validation = {
  // Validación de campos vacíos
  isEmpty(value) {
    return value === null || value === undefined || String(value).trim() === '';
  },

  // Validación de email
  isEmailValid(email) {
    if (this.isEmpty(email)) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  // Validación de contraseña (mínimo 6 caracteres)
  isPasswordValid(password, minLength = 6) {
    if (this.isEmpty(password)) return false;
    return String(password).length >= minLength;
  },

  // Validación de número
  isNumberValid(value) {
    if (this.isEmpty(value)) return false;
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  },

  // Validación de número positivo
  isPositiveNumber(value) {
    if (!this.isNumberValid(value)) return false;
    return parseFloat(value) > 0;
  },

  // Validación de fecha (formato YYYY-MM-DD)
  isDateValid(dateString) {
    if (this.isEmpty(dateString)) return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  },

  // Validación de hora (formato HH:MM)
  isTimeValid(timeString) {
    if (this.isEmpty(timeString)) return false;
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(timeString);
  },

  // Validación de URL
  isUrlValid(url) {
    if (this.isEmpty(url)) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Validación de texto (no vacío y no solo espacios)
  isTextValid(text, minLength = 1) {
    if (this.isEmpty(text)) return false;
    return String(text).trim().length >= minLength;
  },

  // Validación de teléfono (formato simple)
  isPhoneValid(phone) {
    if (this.isEmpty(phone)) return false;
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(String(phone));
  },

  // Validación de formulario de login
  validateLoginForm({ email, password }) {
    const errors = [];
    
    if (this.isEmpty(email)) {
      errors.push('El correo es obligatorio.');
    } else if (!this.isEmailValid(email)) {
      errors.push('El correo no tiene un formato válido.');
    }

    if (this.isEmpty(password)) {
      errors.push('La contraseña es obligatoria.');
    } else if (!this.isPasswordValid(password)) {
      errors.push('La contraseña debe tener al menos 6 caracteres.');
    }

    return { ok: errors.length === 0, errors };
  },

  // Validación de formulario de registro
  validateSignupForm({ email, password, passwordConfirm }) {
    const errors = [];

    if (this.isEmpty(email)) {
      errors.push('El correo es obligatorio.');
    } else if (!this.isEmailValid(email)) {
      errors.push('El correo no tiene un formato válido.');
    }

    if (this.isEmpty(password)) {
      errors.push('La contraseña es obligatoria.');
    } else if (!this.isPasswordValid(password)) {
      errors.push('La contraseña debe tener al menos 6 caracteres.');
    }

    if (this.isEmpty(passwordConfirm)) {
      errors.push('Debe confirmar la contraseña.');
    } else if (password !== passwordConfirm) {
      errors.push('Las contraseñas no coinciden.');
    }

    return { ok: errors.length === 0, errors };
  },

  // Validación de integrante
  validateMember({ nombre, rol }) {
    const errors = [];

    if (!this.isTextValid(nombre, 2)) {
      errors.push('El nombre debe tener al menos 2 caracteres.');
    }

    if (!this.isTextValid(rol, 2)) {
      errors.push('El rol debe tener al menos 2 caracteres.');
    }

    return { ok: errors.length === 0, errors };
  },

  // Validación de presentación
  validatePresentation({ lugar, fecha, hora, precio }) {
    const errors = [];

    if (!this.isTextValid(lugar, 2)) {
      errors.push('El lugar debe tener al menos 2 caracteres.');
    }

    if (!this.isDateValid(fecha)) {
      errors.push('La fecha debe ser válida (YYYY-MM-DD).');
    }

    if (!this.isEmpty(hora) && !this.isTimeValid(hora)) {
      errors.push('La hora debe tener formato HH:MM.');
    }

    if (!this.isEmpty(precio) && !this.isPositiveNumber(precio)) {
      errors.push('El precio debe ser un número positivo.');
    }

    return { ok: errors.length === 0, errors };
  },

  // Validación de disco
  validateAlbum({ nombre, year, formato }) {
    const errors = [];

    if (!this.isTextValid(nombre, 2)) {
      errors.push('El nombre del disco debe tener al menos 2 caracteres.');
    }

    if (!this.isEmpty(year)) {
      if (!this.isNumberValid(year)) {
        errors.push('El año debe ser un número válido.');
      } else if (parseInt(year) < 1900 || parseInt(year) > new Date().getFullYear() + 10) {
        errors.push(`El año debe estar entre 1900 y ${new Date().getFullYear() + 10}.`);
      }
    }

    if (!this.isEmpty(formato) && !this.isTextValid(formato, 2)) {
      errors.push('El formato debe tener al menos 2 caracteres.');
    }

    return { ok: errors.length === 0, errors };
  }
};

export default Validation;
