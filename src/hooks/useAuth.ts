import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  const signOut = () => {
    dispatch(logout());
  };

  return { token, user, signOut };
}
