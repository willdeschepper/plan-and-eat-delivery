import z from 'zod';

import {
  logMissingApiBaseUrl,
  logResolvedApiBaseUrl,
} from '@/lib/api/log-api-debug';

import packageJSON from './package.json';

const envSchema = z.object({
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'preview', 'production']),
  EXPO_PUBLIC_NAME: z.string(),
  EXPO_PUBLIC_SCHEME: z.string(),
  EXPO_PUBLIC_BUNDLE_ID: z.string(),
  EXPO_PUBLIC_PACKAGE: z.string(),
  EXPO_PUBLIC_VERSION: z.string(),
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_ASSOCIATED_DOMAIN: z.string().url().optional(),
  EXPO_PUBLIC_VAR_NUMBER: z.number(),
  EXPO_PUBLIC_VAR_BOOL: z.boolean(),
  EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS: z.string(),
  EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID: z.string(),

  // Build-time configuration. This is not bundled as EXPO_PUBLIC_*.
  EAS_PROJECT_ID: z.string().uuid().optional(),
  APP_BUILD_ONLY_VAR: z.string().optional(),
});

const EXPO_PUBLIC_APP_ENV = (process.env.EXPO_PUBLIC_APP_ENV
  ?? 'development') as z.infer<typeof envSchema>['EXPO_PUBLIC_APP_ENV'];

const BUNDLE_IDS = {
  development: 'com.planandeat.courier',
  preview: 'com.planandeat.courier',
  production: 'com.planandeat.courier',
} as const;

const PACKAGES = {
  development: 'com.planandeat.courier',
  preview: 'com.planandeat.courier',
  production: 'com.planandeat.courier',
} as const;

const SCHEMES = {
  development: 'PlanAndEatCourier',
  preview: 'PlanAndEatCourier',
  production: 'PlanAndEatCourier',
} as const;

const NAME = 'Plan&Eat Courier';

const apiUrlDevelopment = process.env.EXPO_PUBLIC_API_URL_DEVELOPMENT?.trim() ?? '';
const apiUrlProduction = process.env.EXPO_PUBLIC_API_URL_PRODUCTION?.trim() ?? '';

const EXPO_PUBLIC_API_URL
  = EXPO_PUBLIC_APP_ENV === 'production' || EXPO_PUBLIC_APP_ENV === 'preview'
    ? apiUrlProduction || apiUrlDevelopment
    : apiUrlDevelopment || apiUrlProduction;

if (!EXPO_PUBLIC_API_URL.trim()) {
  logMissingApiBaseUrl();
}
else {
  logResolvedApiBaseUrl(EXPO_PUBLIC_API_URL);
}

const STRICT_ENV_VALIDATION = process.env.STRICT_ENV_VALIDATION === '1';

const _env: z.infer<typeof envSchema> = {
  EXPO_PUBLIC_APP_ENV,
  EXPO_PUBLIC_NAME: NAME,
  EXPO_PUBLIC_SCHEME: SCHEMES[EXPO_PUBLIC_APP_ENV],
  EXPO_PUBLIC_BUNDLE_ID: BUNDLE_IDS[EXPO_PUBLIC_APP_ENV],
  EXPO_PUBLIC_PACKAGE: PACKAGES[EXPO_PUBLIC_APP_ENV],
  EXPO_PUBLIC_VERSION: packageJSON.version,
  EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_ASSOCIATED_DOMAIN: process.env.EXPO_PUBLIC_ASSOCIATED_DOMAIN,
  EXPO_PUBLIC_VAR_NUMBER: Number(process.env.EXPO_PUBLIC_VAR_NUMBER ?? 0),
  EXPO_PUBLIC_VAR_BOOL: process.env.EXPO_PUBLIC_VAR_BOOL === 'true',
  EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS:
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS ?? '',
  EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID:
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID ?? '',
  EAS_PROJECT_ID: process.env.EAS_PROJECT_ID?.trim() || undefined,
  APP_BUILD_ONLY_VAR: process.env.APP_BUILD_ONLY_VAR,
};

function getValidatedEnv(env: z.infer<typeof envSchema>) {
  const parsed = envSchema.safeParse(env);

  if (parsed.success) {
    console.log('✅ Environment variables validated successfully');
    return parsed.data;
  }

  const errorMessage
    = `❌ Invalid environment variables:${
      JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
    }\n❌ Missing variables in .env file for APP_ENV=${EXPO_PUBLIC_APP_ENV}`
    + `\n💡 Tip: If you recently updated the .env file, try restarting with -c flag to clear the cache.`;

  if (STRICT_ENV_VALIDATION) {
    console.error(errorMessage);
    throw new Error('Invalid environment variables');
  }

  return env;
}

const Env = STRICT_ENV_VALIDATION ? getValidatedEnv(_env) : _env;

export default Env;
