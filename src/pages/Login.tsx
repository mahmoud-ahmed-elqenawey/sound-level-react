import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    const { email, password } = data;

    if (email && password.length >= 4) {
      // محاكاة التأخير
      await new Promise((resolve) => setTimeout(resolve, 500));

      localStorage.setItem("token", "mock-token-123");
      toast.success("تم تسجيل الدخول بنجاح ✅");
      navigate("/");
    } else {
      toast.error("بيانات الدخول غير صحيحة ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto p-4 space-y-4"
    >
      <div>
        <label className="block mb-1">الإيميل</label>
        <input
          {...register("email", { required: "الإيميل مطلوب" })}
          type="email"
          className="w-full border rounded px-3 py-2"
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block mb-1">كلمة السر</label>
        <input
          {...register("password", { required: "كلمة السر مطلوبة" })}
          type="password"
          className="w-full border rounded px-3 py-2"
        />
        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        تسجيل الدخول
      </button>
    </form>
  );
}
