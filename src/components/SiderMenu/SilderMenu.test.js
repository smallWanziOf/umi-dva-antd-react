import { getMeunMatcheys } from './SiderMenu';

const meun = ['/customers', '/userinfo', '/customers/name', '/userinfo/:id', '/userinfo/:id/info'];

describe('test meun match', () => {
    it('simple path', () => {
        expect(getMeunMatcheys(meun, '/customers')).toEqual(['/customers']);
    });
    it('error path', () => {
        expect(getMeunMatcheys(meun, '/customersname')).toEqual([]);
    });

    it('Secondary path', () => {
        expect(getMeunMatcheys(meun, '/customers/name')).toEqual(['/customers/name']);
    });

    it('Parameter path', () => {
        expect(getMeunMatcheys(meun, '/userinfo/2144')).toEqual(['/userinfo/:id']);
    });

    it('three parameter path', () => {
        expect(getMeunMatcheys(meun, '/userinfo/2144/info')).toEqual(['/userinfo/:id/info']);
    });
});
