type Validator = (value: string | undefined | null) => string | null;

const phoneValidator: Validator = (value) => {
  if (!value) return null;
  const isValid = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value);
  return isValid ? null : "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại đúng định dạng.";
};

const emailValidator: Validator = (value) => {
  if (!value) return null;
  if (!/^[^@]+@[^@]+$/.test(value)) {
    return "Email phải chứa ký tự @";
  }
  if (value.length > 50) {
    return "Email phải có tối đa 50 ký tự";
  }
  // basic email shape check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Email không hợp lệ";
  }
  return null;
};

const passwordValidator: Validator = (value) => {
  const v = value ?? "";
  if (v.length < 8) {
    return "Mật khẩu phải có ít nhất 8 ký tự";
  }
  if (/\s/.test(v)) {
    return "Mật khẩu không được chứa khoảng trắng";
  }
  return null;
};

const confirmPasswordValidator: Validator = (value) => {
  const v = value ?? "";
  if (/\s/.test(v)) {
    return "Mật khẩu không được chứa khoảng trắng";
  }
  return null;
};

export const ListSchema = {
  phone: phoneValidator,
  email: emailValidator,
  password: passwordValidator,
  confirmPassword: confirmPasswordValidator,
};
