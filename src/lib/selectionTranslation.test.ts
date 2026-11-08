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
it('uses the exact Russian alternative when the service ranks an untranslated phrase first',async()=>{
 const f=vi.fn().mockResolvedValue(new Response(JSON.stringify({responseStatus:200,responseData:{translatedText:'Key Idea'},matches:[{segment:'Key Idea',translation:'Key Idea',match:.96},{segment:'Key idea',translation:'Ключевая идея',match:.85}]})));
 vi.stubGlobal('fetch',f);
 expect(await translateSelection('Key idea:','en')).toBe('Ключевая идея');
 expect(f).toHaveBeenCalledTimes(1);
});
it('never substitutes the translation of a neighbouring fuzzy match',async()=>{
 const f=vi.fn().mockResolvedValue(new Response(JSON.stringify({responseStatus:200,responseData:{translatedText:'Another heading'},matches:[{segment:'A completely different heading',translation:'Другая фраза',match:.98}]})));
 vi.stubGlobal('fetch',f);
 await expect(translateSelection('Another heading','en')).rejects.toThrow('не нашёл русский перевод');
});
it('does not cache unchanged source text as a successful translation',async()=>{
 const f=vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({responseStatus:200,responseData:{translatedText:'Example heading'}}))).mockResolvedValueOnce(new Response(JSON.stringify({responseStatus:200,responseData:{translatedText:'Пример заголовка'}})));
 vi.stubGlobal('fetch',f);
 await expect(translateSelection('Example heading','en')).rejects.toThrow('не нашёл русский перевод');
 expect(await translateSelection('Example heading','en')).toBe('Пример заголовка');
 expect(f).toHaveBeenCalledTimes(2);
});
