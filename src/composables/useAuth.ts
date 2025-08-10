import { ref, onMounted, onUnmounted } from 'vue';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut,
    type User
} from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'vue-router';
import { FirebaseError } from 'firebase/app';

export function useAuth() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const success = ref('');
    const isLoading = ref(false);
    const showPassword = ref(false);
    const router = useRouter();
    const user = ref<User | null>(null);

    let unsubscribe: () => void;

    onMounted(() => {
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            user.value = currentUser;
        });
    });

    onUnmounted(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });

    const clearErrors = () => {
        error.value = '';
        emailError.value = '';
        passwordError.value = '';
        success.value = '';
    };

    const login = async () => {
        clearErrors();
        isLoading.value = true;
        try {
            await signInWithEmailAndPassword(auth, email.value, password.value);
            router.push('/');
        } catch (err) {
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case 'auth/user-not-found':
                    case 'auth/invalid-email':
                        emailError.value = 'No existe una cuenta con este correo electrónico.';
                        break;
                    case 'auth/wrong-password':
                        passwordError.value = 'La contraseña es incorrecta.';
                        break;
                    default:
                        error.value = 'Credenciales incorrectas o error de autenticación.';
                        break;
                }
            } else {
                error.value = 'Ocurrió un error inesperado.';
            }
        } finally {
            isLoading.value = false;
        }
    };

    const register = async () => {
        clearErrors();
        if (password.value.length < 6) {
            passwordError.value = 'La contraseña debe tener al menos 6 caracteres.';
            return;
        }

        isLoading.value = true;
        try {
            await createUserWithEmailAndPassword(auth, email.value, password.value);
            success.value = 'Usuario registrado correctamente. Ahora puedes iniciar sesión.';
            password.value = ''; // Limpiar contraseña después del registro
        } catch (err) {
            if (err instanceof FirebaseError) {
                if (err.code === 'auth/email-already-in-use') {
                    emailError.value = 'Este correo electrónico ya está en uso.';
                } else {
                    error.value = 'No se pudo registrar el usuario. ¿Ya existe la cuenta?';
                }
            } else {
                error.value = 'Ocurrió un error inesperado.';
            }
        } finally {
            isLoading.value = false;
        }
    };

    const forgotPassword = async () => {
        clearErrors();
        if (!email.value) {
            emailError.value = 'Por favor, ingresa tu correo electrónico para restablecer la contraseña.';
            return;
        }

        isLoading.value = true;
        try {
            await sendPasswordResetEmail(auth, email.value);
            success.value = 'Se ha enviado un correo de restablecimiento de contraseña. Revisa tu bandeja de entrada.';
        } catch (err) {
            if (err instanceof FirebaseError) {
                if (err.code === 'auth/user-not-found') {
                    emailError.value = 'No existe una cuenta con este correo electrónico.';
                } else {
                    error.value = 'No se pudo enviar el correo de restablecimiento de contraseña.';
                }
            } else {
                error.value = 'Ocurrió un error inesperado.';
            }
        } finally {
            isLoading.value = false;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (err) {
            error.value = 'Error al cerrar sesión.';
        }
    };

    return {
        email,
        password,
        error,
        emailError,
        passwordError,
        success,
        isLoading,
        showPassword,
        user,
        login,
        register,
        forgotPassword,
        logout
    };
}
