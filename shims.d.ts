import { Profile } from './lib/types.d';



declare module '@nuogz/pangu' {
	interface PoseidonInterface {
		profile: Profile[];
	}
}
