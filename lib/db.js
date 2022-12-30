import { C, G } from '@nuogz/pangu';

import Postgres from '@nuogz/postgresql';


export const DB = await new Postgres(C.db, { logger: G, locale: C.log.locale });
