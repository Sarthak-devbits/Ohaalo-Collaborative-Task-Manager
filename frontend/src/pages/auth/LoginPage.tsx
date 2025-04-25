import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slice/userSlice";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        console.log(response?.data?.data);
        const result = response?.data?.data;
        const accessToken = result?.accessToken;
        const refreshToken = result?.refreshToken;
        const user = result?.user;
        // Save tokens and user data to local storage or context
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        dispatch(login(user));
        navigate("/dashboard");
      },
      onError: (error: any) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.response?.data?.message || error.message,
        });
        console.log(error);
        console.error(
          "Login error:",
          error.response?.data?.message || error.message
        );
        // Optionally show toast
      },
    });
  };

  const handleGoogleLogin = () => {
    console.log("Google Login Triggered");
    // Connect this to your Google OAuth handler (e.g. Firebase, NextAuth, etc.)
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {/* Google Login Button */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-black"
          variant="outline"
        >
          <img
            src="https://brandlogo.org/wp-content/uploads/2024/05/Google-G-Logo-300x300.png.webp"
            alt="Google Icon"
            className="h-5 w-5"
          />
          Sign in with Google
        </Button>

        <div className="text-center text-gray-500 text-sm">or</div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
