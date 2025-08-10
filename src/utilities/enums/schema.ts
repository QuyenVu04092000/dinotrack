import * as Yup from "yup";

const ListSchema = {
  phone: Yup.string().test(
    "is-valid-phone",
    "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại đúng định dạng.",
    (value) => {
      if (!value) {
        return true;
      }
      // eslint-disable-next-line no-useless-escape
      return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value);
    },
  ),
  email: Yup.string()
    .email("Email không hợp lệ")
    .max(50, "Email phải có tối đa 50 ký tự")
    .matches(/^[^@]+@[^@]+$/, "Email phải chứa ký tự @"),
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .test("no-spaces", "Mật khẩu không được chứa khoảng trắng", (value) => !/\s/.test(value ?? "")),
  confirmPassword: Yup.string().test(
    "no-spaces",
    "Mật khẩu không được chứa khoảng trắng",
    (value) => !/\s/.test(value ?? ""),
  ),
};

export { ListSchema };
