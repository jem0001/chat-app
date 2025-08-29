import { useDispatch, useSelector } from "react-redux";
import { useCheckAuthQuery } from "../features/auth/authApi";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { setAuthUser } from "../features/auth/authSlice";
import Loading from "./Loading";

const ProtectRoute = () => {
  const authUser = useSelector((state) => state.auth);
  const { data: user, error, isLoading } = useCheckAuthQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      console.log(user);
      dispatch(setAuthUser(user));
    }
  }, [user]);

  if (error) return <Navigate to="/login"></Navigate>;
  if (isLoading) return <Loading />;

  return <Outlet />;
};
export default ProtectRoute;
