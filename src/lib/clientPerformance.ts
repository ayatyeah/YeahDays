export const PERFORMANCE_INIT_SCRIPT = `(function(){try{
  var memory = navigator.deviceMemory;
  var constrainedTouchDevice = matchMedia('(pointer: coarse)').matches &&
    typeof memory === 'number' && memory > 0 && memory <= 4;
  if (constrainedTouchDevice) {
    document.documentElement.setAttribute('data-performance', 'light');
  }
}catch(e){}})();`;
