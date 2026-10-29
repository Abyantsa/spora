export const rp = (n: number) => n === 0 ? 'Gratis' : 'Rp' + n.toLocaleString('id-ID');
export const endTime = (t: string, d: number) => { 
  const h = parseInt(t) + d; 
  return String(h).padStart(2,'0') + '.00'; 
};
