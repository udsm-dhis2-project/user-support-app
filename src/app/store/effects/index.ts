import { UserEffects } from './user.effects';
import { SystemInfoEffects } from './system-info.effects';
import { RouterEffects } from './router.effects';
import { SystemConfigsEffects } from './system-configurations.effects';
import { TranslationsEffects } from './translations.effects';

export const effects: any[] = [
  UserEffects,
  SystemInfoEffects,
  RouterEffects,
  SystemConfigsEffects,
  TranslationsEffects,
];
