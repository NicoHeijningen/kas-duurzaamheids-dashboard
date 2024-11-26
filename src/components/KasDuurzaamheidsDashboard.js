import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sun, 
  Zap, 
  Earth,
  LeafyGreen,
  Factory
} from 'lucide-react';
import { 
  PieChart, 
  BarChart, 
  Pie, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const KasDuurzaamheidsDashboard = () => {
  const [energieBronnen, setEnergieBronnen] = useState([
    { 
      naam: 'Aardgas', 
      percentage: 40, 
      prijsMwh: 85, // €/MWh
      co2UitstootMwh: 490, // kg CO2 per MWh
      kleur: '#FF6B6B',
      icon: <Flame color="#FF6B6B" size={32} />,
      beschrijving: 'Traditionele fossiele energiebron voor kassen'
    },
    { 
      naam: 'Zonne-energie', 
      percentage: 20, 
      prijsMwh: 50, // €/MWh
      co2UitstootMwh: 40, // kg CO2 per MWh
      kleur: '#FFA726',
      icon: <Sun color="#FFA726" size={32} />,
      beschrijving: 'Zonnepanelen op kasdaken, hernieuwbare energie'
    },
    { 
      naam: 'Warmtekrachtkoppeling', 
      percentage: 15, 
      prijsMwh: 75, // €/MWh
      co2UitstootMwh: 320, // kg CO2 per MWh
      kleur: '#9C27B0',
      icon: <Factory color="#9C27B0" size={32} />,
      beschrijving: 'Gecombineerde warmte en elektriciteitsproductie'
    },
    { 
      naam: 'Geothermie', 
      percentage: 10, 
      prijsMwh: 60, // €/MWh
      co2UitstootMwh: 30, // kg CO2 per MWh
      kleur: '#2196F3',
      icon: <Earth color="#2196F3" size={32} />,
      beschrijving: 'Duurzame aardwarmte-energie'
    },
    { 
      naam: 'Groene Waterstof', 
      percentage: 8, 
      prijsMwh: 120, // €/MWh
      co2UitstootMwh: 0, // kg CO2 per MWh
      kleur: '#00BCD4',
      icon: <LeafyGreen color="#00BCD4" size={32} />,
      beschrijving: 'Schone waterstofproductie zonder CO2-uitstoot'
    },
    { 
      naam: 'Elektriciteitsnet', 
      percentage: 7, 
      prijsMwh: 65, // €/MWh
      co2UitstootMwh: 380, // kg CO2 per MWh
      kleur: '#4CAF50',
      icon: <Zap color="#4CAF50" size={32} />,
      beschrijving: 'Mix van energie van het nationale elektriciteitsnet'
    }
  ]);

  // Bereken totale kosten en CO2-uitstoot
  const calculateTotals = () => {
    return energieBronnen.map(bron => ({
      naam: bron.naam,
      totaalPrijsMwh: (bron.prijsMwh * bron.percentage / 100),
      totaalCo2Mwh: (bron.co2UitstootMwh * bron.percentage / 100)
    }));
  };

  const totalen = calculateTotals();

  const totaalPrijsMwh = totalen.reduce((sum, bron) => sum + bron.totaalPrijsMwh, 0);
  const totaalCo2Mwh = totalen.reduce((sum, bron) => sum + bron.totaalCo2Mwh, 0);

  const [remainingPercentage, setRemainingPercentage] = useState(0);

  // Update remaining percentage when energy mix changes
  useEffect(() => {
    const currentTotal = energieBronnen.reduce((sum, bron) => sum + bron.percentage, 0);
    setRemainingPercentage(Math.max(0, 100 - currentTotal));
  }, [energieBronnen]);

  // Handle slider change for a specific energy source
  const handlePercentageChange = (naam, newPercentage) => {
    const updatedBronnen = energieBronnen.map(bron => 
      bron.naam === naam 
        ? { ...bron, percentage: newPercentage }
        : bron
    );

    setEnergieBronnen(updatedBronnen);
  };

  return (
    <div className="min-h-screen bg-green-50 p-8 flex flex-col items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-6xl">
        <div className="bg-green-600 text-white p-6 flex items-center">
          <LeafyGreen size={40} className="mr-4" />
          <h1 className="text-2xl font-bold">Duurzame Kas Energie Dashboard</h1>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Energie Mix Visualisatie */}
          <div className="h-[400px]">
            <h2 className="text-xl font-semibold mb-4">Energiemix Samenstelling</h2>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={energieBronnen}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  dataKey="percentage"
                  label={({ percentage }) => `${percentage}%`}
                >
                  {energieBronnen.map((bron, index) => (
                    <Cell key={`cell-${index}`} fill={bron.kleur} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 shadow-lg rounded-lg">
                          <h3 className="font-bold">{data.naam}</h3>
                          <p>{data.percentage}%</p>
                          <p className="text-sm text-gray-600">{data.beschrijving}</p>
                          <p className="text-sm">Prijs: €{data.prijsMwh.toFixed(2)} per MWh</p>
                          <p className="text-sm">CO2-uitstoot: {data.co2UitstootMwh.toFixed(2)} kg per MWh</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  formatter={(value) => {
                    const bron = energieBronnen.find(b => b.naam === value);
                    return bron ? `${value} (${bron.naam}%)` : value;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Energie Bronnen Details met Sliders */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Energie Bronnen Configuratie</h2>
            {energieBronnen.map((bron, index) => (
              <div 
                key={index} 
                className="bg-green-100 p-4 rounded-lg"
              >
                <div className="flex items-center mb-2">
                  <div className="mr-4">{bron.icon}</div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-green-800">{bron.naam}</h3>
                    <p className="text-green-600 text-sm">{bron.beschrijving}</p>
                  </div>
                  <div className="text-green-900 font-semibold">
                    {bron.percentage}%
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={bron.percentage}
                    onChange={(e) => handlePercentageChange(bron.naam, Number(e.target.value))}
                    className="flex-grow"
                  />
                </div>
                <div className="flex justify-between text-sm text-green-700 mt-2">
                  <span>Prijs: €{bron.prijsMwh.toFixed(2)} per MWh</span>
                  <span>CO2: {bron.co2UitstootMwh.toFixed(2)} kg per MWh</span>
                </div>
              </div>
            ))}
            
            {/* Kosten en CO2 Barchart */}
            <div className="h-[300px] mt-6">
              <h2 className="text-xl font-semibold mb-4">Kosten en CO2-uitstoot per Energiebron</h2>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={totalen}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="naam" />
                  <YAxis yAxisId="prijs" label={{ value: 'Prijs (€/MWh)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="co2" orientation="right" label={{ value: 'CO2 (kg/MWh)', angle: 90, position: 'insideRight' }} />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      name === 'totaalPrijsMwh' ? `€${value.toFixed(2)}` : `${value.toFixed(2)} kg`,
                      name === 'totaalPrijsMwh' ? 'Prijs' : 'CO2-uitstoot'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="prijs" dataKey="totaalPrijsMwh" name="Prijs" fill="#8884d8" />
                  <Bar yAxisId="co2" dataKey="totaalCo2Mwh" name="CO2-uitstoot" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-green-200 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Totaaloverzicht</h3>
              <div className="flex justify-between">
                <span>Totale energiekosten:</span>
                <span className="font-semibold">€{totaalPrijsMwh.toFixed(2)} per MWh</span>
              </div>
              <div className="flex justify-between">
                <span>Totale CO2-uitstoot:</span>
                <span className="font-semibold">{totaalCo2Mwh.toFixed(2)} kg per MWh</span>
              </div>
            </div>

            <div className="text-sm mt-4">
              {remainingPercentage === 0 ? (
                <div className="text-green-600 font-semibold">
                  Energiemix volledig geconfigureerd ✓
                </div>
              ) : (
                <div className="text-red-600 font-semibold">
                  Nog {remainingPercentage}% beschikbaar om toe te wijzen
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KasDuurzaamheidsDashboard;