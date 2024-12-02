import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const VPDChart = () => {
  const [airRH, setAirRH] = useState(50);
  const [airTemp, setAirTemp] = useState(25);
  const [leafTemp, setLeafTemp] = useState(25);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const chartRef = useRef(null);

  const calculateVPD = (airTemp, leafTemp, rh) => {
    const SVP_air = 0.611 * Math.exp((17.502 * airTemp) / (airTemp + 240.97));
    const SVP_leaf = 0.611 * Math.exp((17.502 * leafTemp) / (leafTemp + 240.97));
    const VP_air = SVP_air * (rh / 100);
    return SVP_leaf - VP_air;
  };

  const calculateDewPoint = (temp, rh) => {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(rh/100);
    return (b * alpha) / (a - alpha);
  };

  const getTranspirationState = (vpd) => {
    const dewPoint = calculateDewPoint(airTemp, airRH);
    if (leafTemp <= dewPoint) return "Ziektegevaar";
    if (vpd < 0.4) return "Onder Transpiratie";
    if (vpd < 0.8) return "Lage Transpiratie";
    if (vpd < 1.2) return "Gezonde Transpiratie";
    if (vpd < 1.6) return "Hoge Transpiratie";
    return "Over Transpiratie";
  };

  const getZoneColor = (temp, rh) => {
    const vpd = calculateVPD(temp, leafTemp, rh);
    const dewPoint = calculateDewPoint(temp, rh);
    
    if (leafTemp <= dewPoint) return '#FFA500';
    if (vpd < 0.4) return '#8B4513';
    if (vpd < 0.8) return '#90EE90';
    if (vpd < 1.2) return '#32CD32';
    if (vpd < 1.6) return '#FFD700';
    return '#87CEEB';
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => {
        if (!isDragging || !chartRef.current) return;
        const rect = chartRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - 32;
        const y = e.clientY - rect.top - 32;
        const chartWidth = rect.width - 64;
        const chartHeight = rect.height - 64;
        let newRH = 100 - (x / chartWidth * 100);
        let newTemp = (y / chartHeight * 40);
        newRH = Math.max(0, Math.min(100, newRH));
        newTemp = Math.max(0, Math.min(40, newTemp));
        setAirRH(Math.round(newRH));
        setAirTemp(Math.round(newTemp));
      };
  
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
  
      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isDragging]);

  const vpd = calculateVPD(airTemp, leafTemp, airRH);
  const transpirationState = getTranspirationState(vpd);
  const currentZoneColor = getZoneColor(airTemp, airRH);

  return (
    <Card className="w-full max-w-4xl bg-slate-900 p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4 text-white">VPD Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative pl-16 pr-8 pb-16 pt-8">
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-white whitespace-nowrap text-sm font-medium">
                Luchttemperatuur (°C)
              </div>
              
              <div className="absolute bottom-0 left-16 right-8 text-center text-white text-sm font-medium">
                Luchtvochtigheid RV (%)
              </div>

              <div 
                ref={chartRef}
                className="relative h-[500px] bg-slate-800 rounded-lg p-8"
                onMouseDown={handleMouseDown}
              >
                <div className="absolute inset-8 grid grid-cols-10 grid-rows-10">
                  {Array.from({ length: 100 }, (_, i) => {
                    const row = Math.floor(i / 10);
                    const col = i % 10;
                    const temp = 40 - (row * 4);
                    const rh = 100 - (col * 10);
                    return (
                      <div
                        key={i}
                        style={{ backgroundColor: getZoneColor(temp, rh) }}
                        className="border border-slate-700/30"
                      />
                    );
                  })}
                </div>

                <div className="absolute left-0 top-8 bottom-8 flex flex-col justify-between">
                  {Array.from({ length: 11 }, (_, i) => (
                    <div key={i} className="flex items-center">
                      <span className="text-white text-xs w-6 text-right mr-2">
                        {40 - i * 4}°C
                      </span>
                      <div className="w-2 h-px bg-white/50" />
                    </div>
                  ))}
                </div>

                <div className="absolute left-8 right-8 bottom-0 flex justify-between">
                  {Array.from({ length: 11 }, (_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="h-2 w-px bg-white/50" />
                      <span className="text-white text-xs mt-2">
                        {100 - i * 10}%
                      </span>
                    </div>
                  ))}
                </div>

                <div 
                  className="absolute w-4 h-4 rounded-full bg-white border-2 border-black cursor-pointer z-10"
                  style={{
                    left: `${8 + ((100 - airRH) / 100) * (100 - 16)}%`,
                    top: `${8 + (airTemp / 40) * (100 - 16)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseEnter={() => setHoverInfo({
                    vpd: vpd.toFixed(2),
                    airRH,
                    airTemp,
                    leafTemp
                  })}
                  onMouseLeave={() => setHoverInfo(null)}
                />

                {hoverInfo && (
                  <div 
                    className="absolute z-20 bg-slate-700 p-2 rounded shadow-lg text-white text-sm"
                    style={{
                      left: `${8 + ((100 - airRH) / 100) * (100 - 16)}%`,
                      top: `${8 + (airTemp / 40) * (100 - 16)}%`,
                      transform: 'translate(-50%, -120%)'
                    }}
                  >
                    <div>VPD = {hoverInfo.vpd} kPa</div>
                    <div>Lucht RV = {hoverInfo.airRH}%</div>
                    <div>Luchttemp = {hoverInfo.airTemp}°C</div>
                    <div>Bladtemp = {hoverInfo.leafTemp}°C</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 text-white">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Lucht RV: {airRH}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={airRH}
                  onChange={(e) => setAirRH(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Luchttemperatuur: {airTemp}°C</label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={airTemp}
                  onChange={(e) => setAirTemp(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bladtemperatuur: {leafTemp}°C</label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={leafTemp}
                  onChange={(e) => setLeafTemp(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center text-lg font-semibold">
                  <span className="mr-2">VPD =</span>
                  <span 
                    className="px-2 py-1 rounded text-black"
                    style={{ backgroundColor: currentZoneColor }}
                  >
                    {vpd.toFixed(2)} kPa
                  </span>
                </div>
                <div className="text-sm text-slate-300 mt-1">{transpirationState}</div>
              </div>
            </div>

            <div className="space-y-2 bg-slate-800 p-4 rounded-lg text-sm">
              <div className="flex items-center">
                <span className="w-4 h-4 inline-block mr-2 rounded bg-orange-500" />
                Bladtemp onder dauwpunt (Ziektegevaar)
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-block mr-2 rounded" style={{backgroundColor: '#8B4513'}} />
                VPD onder 0.4 kPa (Onder Transpiratie)
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-block mr-2 rounded" style={{backgroundColor: '#90EE90'}} />
                VPD 0.4-0.8 kPa (Lage Transpiratie)
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-block mr-2 rounded" style={{backgroundColor: '#32CD32'}} />
                VPD 0.8-1.2 kPa (Gezonde Transpiratie)
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-block mr-2 rounded" style={{backgroundColor: '#FFD700'}} />
                VPD 1.2-1.6 kPa (Hoge Transpiratie)
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-block mr-2 rounded" style={{backgroundColor: '#87CEEB'}} />
                VPD boven 1.6 kPa (Over Transpiratie)
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VPDChart;