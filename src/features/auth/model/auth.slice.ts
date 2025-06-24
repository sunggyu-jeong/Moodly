import { ApiResponse } from '@/entities/common/response';
import { AsyncOperationState, createInitialAsyncState } from '@/shared/constants';
import { addAsyncThunkCase } from '@/shared/lib';
import { supabase } from '@/shared/lib/supabase.util';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import appleAuth from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthError, User } from '@supabase/supabase-js';

const signInGoogleThunk = createAsyncThunk<ApiResponse<User>, void, { rejectValue: AuthError }>(
  'auth/signInGoogle',
  async (_, { rejectWithValue }) => {
    try {
      await GoogleSignin.hasPlayServices();
      GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });
      if (error) {
        return rejectWithValue(error);
      }
      return { session: data.session, data: data.session?.user ?? null, error: null };
    } catch (err) {
      return rejectWithValue(err as AuthError);
    }
  }
);

const signInAppleThunk = createAsyncThunk<ApiResponse<User>, void, { rejectValue: AuthError }>(
  'auth/signInApple',
  async (_, { rejectWithValue }) => {
    try {
      const appleResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken, nonce } = appleResponse;
      if (!identityToken) {
        throw new Error('Apple 로그인에 실패했습니다: identityToken이 없습니다.');
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: identityToken,
        nonce,
      });

      if (error) {
        return rejectWithValue(error);
      }

      return {
        session: data.session,
        data: data.session?.user ?? null,
        error: null,
      };
    } catch (err) {
      return rejectWithValue(err as AuthError);
    }
  }
);

const initializeSessionThunk = createAsyncThunk<
  ApiResponse<User>,
  void,
  { rejectValue: AuthError }
>('auth/initializeSession', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return rejectWithValue(error);
    }
    return { session: data.session, data: data.session?.user ?? null, error: null };
  } catch (err) {
    return rejectWithValue(err as AuthError);
  }
});

interface AuthState {
  userInfo: AsyncOperationState<User>;
}

const initialState: AuthState = {
  userInfo: createInitialAsyncState<User>(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: state => {
      state.userInfo = createInitialAsyncState<User>();
    },
    setAuthState: (state, action) => {
      state.userInfo.status = action.payload.status;
      state.userInfo.data = action.payload.data;
      state.userInfo.error = action.payload.error;
    },
  },
  extraReducers: builder => {
    addAsyncThunkCase<ApiResponse<User>, AuthState>({
      builder,
      thunk: signInGoogleThunk,
      key: 'userInfo',
      defaultErrorMessage: '로그인에 실패했습니다. 다시 시도해주세요.',
    });
    addAsyncThunkCase<ApiResponse<User>, AuthState>({
      builder,
      thunk: signInAppleThunk,
      key: 'userInfo',
      defaultErrorMessage: '로그인에 실패했습니다. 다시 시도해주세요.',
    });

    addAsyncThunkCase<ApiResponse<User>, AuthState>({
      builder,
      thunk: initializeSessionThunk,
      key: 'userInfo',
      defaultErrorMessage: '세션 초기화에 실패했습니다. 다시 시도해주세요.',
    });
  },
});

export { initializeSessionThunk, signInAppleThunk, signInGoogleThunk };
export const { resetAuthState, setAuthState } = authSlice.actions;

export default authSlice.reducer;
