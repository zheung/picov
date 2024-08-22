import { C } from '@nuogz/pangu';



export const method = 'get';
export const handle = () => C.profile.map(profile => profile.name);
