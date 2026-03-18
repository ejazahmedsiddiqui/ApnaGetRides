// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import {createMMKV} from "react-native-mmkv";
// import * as SecureStore from "expo-secure-store";
// import {getUserProfile} from "@/api";
//
// const storage = createMMKV({ id: 'user-storage'})
//
// // Types
// interface UserState {
//     phone: string | null;
//     token: string | null;
//     gender: string | null;
//     email: string | null;
//     fullName: string | null;
//     profilePicture: string | null;
//     isAuthenticated: boolean;
//     isLoading: boolean;
// }
//
// interface UserContextType extends UserState {
//     login: (phone: string, token: string) => Promise<{ success: boolean; data: string }>;
//     logout: () => Promise<{ success: boolean }>;
//     updateToken: (newToken: string) => Promise<void>;
//     getProfile: (token: string) => Promise<void>;
//     updateProfile: (profile: Partial<Pick<UserState, "gender" | "email" | "fullName" | "profilePicture">>) => Promise<void>;
// }
//
// interface UserProviderProps {
//     children: ReactNode;
// }
//
// const SECURE_KEYS = {
//     TOKEN: "userToken",
// } as const;
//
// const STORAGE_KEYS = {
//     PHONE: "userPhone",
//     GENDER: "userGender",
//     EMAIL: "userEmail",
//     FULL_NAME: "userFullName",
//     PROFILE_PICTURE: "userProfilePicture",
// } as const;
//
// const secureGet = (key: string): Promise<string | null> => SecureStore.getItemAsync(key);
// const secureSet = (key: string, value: string): Promise<void> => SecureStore.setItemAsync(key, value);
// const secureDelete = (key: string): Promise<void> => SecureStore.deleteItemAsync(key);
//
// const mmkvGet = (key: string): string | null => storage.getString(key) ?? null;
// const mmkvSet = (key: string, value: string): void => storage.set(key, value);
// const mmkvDelete = (key: string): boolean => storage.remove(key);
//
// // Context
// const OldUserContext = createContext<UserContextType | null>(null);
//
// export const OldUserProvider = ({ children }: UserProviderProps) => {
//     const [user, setUser] = useState<UserState>({
//         phone: null,
//         token: null,
//         gender: null,
//         email: null,
//         fullName: null,
//         profilePicture: null,
//         isAuthenticated: false,
//         isLoading: true,
//     });
//
//     useEffect(() => {
//         loadUserData()
//             .catch((error) => console.log('There was an error loading user Data: ', error));
//     }, []);
//
//     const loadUserData = async (): Promise<void> => {
//         try {
//             const token = await secureGet(SECURE_KEYS.TOKEN);
//             const phone = mmkvGet(STORAGE_KEYS.PHONE);
//
//             if (phone && token) {
//                 setUser((prev) => ({...prev,
//                     phone,
//                     gender: mmkvGet(STORAGE_KEYS.GENDER),
//                     email: mmkvGet(STORAGE_KEYS.EMAIL),
//                     fullName: mmkvGet(STORAGE_KEYS.FULL_NAME),
//                     profilePicture: mmkvGet(STORAGE_KEYS.PROFILE_PICTURE),
//                     isAuthenticated: true,
//                     isLoading: false,}));
//             } else {
//                 setUser((prev) => ({ ...prev, isLoading: false }));
//             }
//         } catch (error) {
//             console.error("Error loading user data:", error);
//             setUser((prev) => ({ ...prev, isLoading: false }));
//         }
//     };
//
//     const login =
//         async (phone: string, token: string): Promise<{ success: boolean; data: string }> =>
//         {
//         try {
//             await secureSet(SECURE_KEYS.TOKEN, token);
//             mmkvSet(STORAGE_KEYS.PHONE, phone);
//             await getProfile()
//                 .then(() => console.log('Get Profile called successfully'))
//                 .catch((e) => console.error(e));
//             return { success: true, data: token };
//         } catch (error) {
//             console.error("Error saving user data:", error);
//             throw error;
//         }
//     };
//
//     const logout = async (): Promise<{ success: boolean }> => {
//         try {
//             await secureDelete(SECURE_KEYS.TOKEN);
//             Object.values(STORAGE_KEYS).forEach(mmkvDelete);
//             setUser({
//                 phone: null,
//                 token: null,
//                 gender: null,
//                 email: null,
//                 fullName: null,
//                 profilePicture: null,
//                 isAuthenticated: false,
//                 isLoading: false,
//             });
//             return { success: true };
//         } catch (error) {
//             console.error("Error clearing user data:", error);
//             throw error;
//         }
//     };
//
//     const updateToken = async (newToken: string): Promise<void> => {
//         try {
//             await secureSet(SECURE_KEYS.TOKEN, newToken);
//             setUser((prev) => ({ ...prev, token: newToken }));
//         } catch (error) {
//             console.error("Error updating token:", error);
//             throw error;
//         }
//     };
//
//     const getProfile = async () => {
//         console.log('@/context/OldUserContext/getProfile Accessed');
//         const token = await secureGet(SECURE_KEYS.TOKEN);
//         console.log('Access Token is: ',token);
//         try {
//             const result = await getUserProfile(token);
//             if(result.success) {
//                 console.log('get profile success, result Data is: ', result.data);
//             }
//         } catch (error) {
//             console.error("Error clearing user data:", error);
//             throw error;
//         }
//     }
//     const updateProfile = async (
//         profile: Partial<Pick<UserState, "gender" | "email" | "fullName" | "profilePicture">>
//     ): Promise<void> => {
//         try {
//             const storageMap: Record<string, string> = {
//                 gender: STORAGE_KEYS.GENDER,
//                 email: STORAGE_KEYS.EMAIL,
//                 fullName: STORAGE_KEYS.FULL_NAME,
//                 profilePicture: STORAGE_KEYS.PROFILE_PICTURE,
//             };
//
//             Object.entries(profile).forEach(([key, value]) => {
//                 if (value != null) {
//                     mmkvSet(storageMap[key], value as string);
//                 }
//             });
//
//             setUser((prev) => ({ ...prev, ...profile }));
//         } catch (error) {
//             console.error("Error updating profile:", error);
//             throw error;
//         }
//     };
//
//     const value: UserContextType = {
//         phone: user.phone,
//         token: user.token,
//         gender: user.gender,
//         email: user.email,
//         fullName: user.fullName,
//         profilePicture: user.profilePicture,
//         isAuthenticated: user.isAuthenticated,
//         isLoading: user.isLoading,
//         login,
//         logout,
//         updateToken,
//         getProfile,
//         updateProfile,
//     };
//
//     return <OldUserContext.Provider value={value}>{children}</OldUserContext.Provider>;
// };
//
// export const useUser = (): UserContextType => {
//     const context = useContext(OldUserContext);
//     if (!context) {
//         throw new Error("useOldUser must be used within a UserProvider");
//     }
//     return context;
// };
//
// export default OldUserContext;