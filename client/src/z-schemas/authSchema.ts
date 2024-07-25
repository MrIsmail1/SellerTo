import { z } from 'zod';

// Schéma de validation pour l'inscription
export const registerSchema = z.object({
  firstname: z.string().min(1, 'Le prénom est requis').max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastname: z.string().min(1, 'Le nom est requis').max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
    .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'Le mot de passe doit inclure une combinaison de chiffres, de lettres et de caractères spéciaux'),
  acceptLegal: z.boolean().refine(val => val === true, 'Vous devez accepter les mentions légales')
});

// Schéma de validation pour la connexion
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
    .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'Le mot de passe doit inclure une combinaison de chiffres, de lettres et de caractères spéciaux')
});

// Schéma de validation pour la réinitialisation du mot de passe oublié
export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

// Schéma de validation pour la réinitialisation du mot de passe
export const resetPasswordSchema = z.object({
  password: z.string()
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
    .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'Le mot de passe doit inclure une combinaison de chiffres, de lettres et de caractères spéciaux')
});
