import { afterEach, expect, it, vi } from 'vitest';
import { translateSelection } from './selectionTranslation';
afterEach(()=>vi.unstubAllGlobals());
it('translates the exact phrase and reuses its result without another provider call',async()=>{
 const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({responseStatus:200,responseData:{translatedText:'IP-адрес'}})));
 vi.stubGlobal('fetch',fetcher);
 expect(await translateSelection('IP address','en')).toBe('IP-адрес');
 expect(await translateSelection('IP address','en')).toBe('IP-адрес');
 expect(fetcher).toHaveBeenCalledTimes(1);
 const url=new URL(fetcher.mock.calls[0][0]);expect(url.searchParams.get('q')).toBe('IP address');expect(url.searchParams.get('langpair')).toBe('en|ru');
});
it('rejects oversized UTF-8 input before any call',async()=>{const f=vi.fn();vi.stubGlobal('fetch',f);await expect(translateSelection('é'.repeat(251),'fr')).rejects.toThrow('короткую фразу');expect(f).not.toHaveBeenCalled();});
it('quota failure stays an error and never falls back to AI',async()=>{const f=vi.fn().mockResolvedValue(new Response(JSON.stringify({responseStatus:403,quotaFinished:true})));vi.stubGlobal('fetch',f);await expect(translateSelection('quota-example','en')).rejects.toThrow('Лимит');expect(f).toHaveBeenCalledTimes(1);});
