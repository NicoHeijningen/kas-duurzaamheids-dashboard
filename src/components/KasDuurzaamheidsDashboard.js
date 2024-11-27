import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Sun, 
  Zap, 
  Globe,
  LeafyGreen,
  Factory
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const KasDuurzaamheidsDashboard = () => {
  const [energyData, setEnergyData] = useState([
    { 
      name: 'Aardgas', 
      value: 40, 
      pricePerMWh: 85,
      co2PerMWh: 0.49,
      icon: <Flame color="#FF6B6B" size={32} />,
      description: 'Traditionele fossiele energiebron voor kassen'
    },
    { 
      name: 'Zonne-energie', 
      value: 20, 
      pricePerMWh: 50,
      co2PerMWh: 0.04,
      icon: <Sun color="#FFA726" size={32} />,
      description: 'Zonnepanelen op kasdaken voor duurzame energie'
    },
    { 
      name: 'Warmtekrachtkoppeling', 
      value: 15, 
      pricePerMWh: 75,
      co2PerMWh: 0.32,
      icon: <Factory color="#9C27B0" size={32} />,
      description: 'Gecombineerde warmte en elektriciteitsproductie'
    },
    { 
      name: 'Geothermie', 
      value: 10, 
      pricePerMWh: 60,
      co2PerMWh: 0.03,
      icon: <Globe color="#2196F3" size={32} />,
      description: 'Duurzame energie uit aardwarmte'
    },
    { 
      name: 'Waterstof', 
      value: 8, 
      pricePerMWh: 120,
      co2PerMWh: 0.00,
      icon: <LeafyGreen color="#00BCD4" size={32} />,
      description: 'Groene waterstof voor schone energieproductie'
    },
    { 
      name: 'Elektriciteitsnet', 
      value: 7, 
      pricePerMWh: 65,
      co2PerMWh: 0.38,
      icon: <Zap color="#4CAF50" size={32} />,
      description: 'Stroom van het nationale elektriciteitsnet'
    }
  ]);

  const COLORS = ['#FF6B6B', '#FFA726', '#9C27B0', '#2196F3', '#00BCD4', '#4CAF50'];

  const calculateTotals = (data) => {
    const totalCost = data.reduce((sum, source) => sum + (source.value * source.pricePerMWh), 0);
    const totalCO2 = data.reduce((sum, source) => sum + (source.value * source.co2PerMWh), 0);
    return { totalCost, totalCO2 };
  };

  const { totalCost, totalCO2 } = useMemo(() => calculateTotals(energyData), [energyData]);

  const handleSliderChange = (index, newValue) => {
    const updatedData = [...energyData];
    const currentTotal = updatedData.reduce((sum, item) => sum + item.value, 0);
    const difference = newValue[0] - updatedData[index].value;
    
    if (currentTotal + difference > 100) {
      const excessAmount = (currentTotal + difference) - 100;
      updatedData.forEach((item, i) => {
        if (i !== index && item.value > 0) {
          const reduceAmount = (item.value / (currentTotal - updatedData[index].value)) * excessAmount;
          item.value = Math.max(0, item.value - reduceAmount);
        }
      });
    }
    
    updatedData[index].value = newValue[0];
    setEnergyData(updatedData);
  };

  const costData = energyData.map(source => ({
    name: source.name,
    cost: source.value * source.pricePerMWh,
    co2: source.value * source.co2PerMWh
  }));

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <Card className="max-w-7xl mx-auto shadow-xl">
        <CardHeader className="bg-green-100 border-b border-green-200">
          <CardTitle className="flex items-center gap-4">
            <LeafyGreen size={40} className="text-green-700" />
            <span className="text-2xl">Kas Energie & Duurzaamheids Dashboard</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="h-[400px]">
              <h3 className="text-xl font-bold mb-4">Energieverdeling</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={energyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {energyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Energiebronnen</h3>
              {energyData.map((source, index) => (
                <div key={source.name} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-4">
                    {source.icon}
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{source.name}</h4>
                        <span>{source.value.toFixed(1)}%</span>
                      </div>
                      <Slider
                        value={[source.value]}
                        onValueChange={(newValue) => handleSliderChange(index, newValue)}
                        max={100}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">{source.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Huidige Metingen</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <LeafyGreen className="text-green-700" />
                    <div>
                      <h4 className="font-semibold">Totale Kosten</h4>
                      <p className="text-2xl font-bold text-green-700">
                        €{totalCost.toFixed(2)}/MWh
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <LeafyGreen className="text-green-700" />
                    <div>
                      <h4 className="font-semibold">CO2 Uitstoot</h4>
                      <p className="text-2xl font-bold text-green-700">
                        {totalCO2.toFixed(2)} ton/MWh
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[200px]">
                <h4 className="text-lg font-semibold mb-2">Kostenanalyse</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cost" fill="#8884d8" name="Kosten (€)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md space-y-6 mt-6">
            <h3 className="text-2xl font-bold text-green-800 border-b pb-3">Milieu Impact Analyse</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <LeafyGreen className="mr-3 text-green-700" size={32} />
                  <h4 className="font-semibold text-lg">CO2 Reductie</h4>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {((0.49 - totalCO2) / 0.49 * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">t.o.v. traditionele methoden</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <LeafyGreen className="mr-3 text-blue-700" size={32} />
                  <h4 className="font-semibold text-lg">Kostenefficiëntie</h4>
                </div>
                <p className="text-3xl font-bold text-blue-700">
                  {((85 - totalCost/100) / 85 * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">kostenbesparing bereikt</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <LeafyGreen className="mr-3 text-yellow-700" size={32} />
                  <h4 className="font-semibold text-lg">Duurzame Energie</h4>
                </div>
                <p className="text-3xl font-bold text-yellow-700">
                  {energyData
                    .filter(source => ['Zonne-energie', 'Geothermie', 'Waterstof'].includes(source.name))
                    .reduce((sum, source) => sum + source.value, 0)
                    .toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">aandeel duurzame energie</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Jaarlijkse Milieu Impact</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>CO2 Uitstoot Vermeden:</span>
                    <span className="font-semibold">
                      {(((0.49 - totalCO2) / 0.49) * 365).toFixed(0)} ton/jaar
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kostenbesparing:</span>
                    <span className="font-semibold">
                      €{(((85 - totalCost/100) / 85) * 365 * 24).toFixed(0)}/jaar
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Duurzame Energie Opgewekt:</span>
                    <span className="font-semibold">
                      {(energyData
                        .filter(source => ['Zonne-energie', 'Geothermie', 'Waterstof'].includes(source.name))
                        .reduce((sum, source) => sum + source.value, 0) * 365 * 24 / 100).toFixed(0)} MWh/jaar
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duurzaamheidsscore:</span>
                    <span className="font-semibold">
                      {(((0.49 - totalCO2) / 0.49 * 100 + 
                        energyData
                          .filter(source => ['Zonne-energie', 'Geothermie', 'Waterstof'].includes(source.name))
                          .reduce((sum, source) => sum + source.value, 0)) / 2).toFixed(1)}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4 text-sm text-gray-600">
              <p><strong>Duurzaamheidsanalyse:</strong> Uw huidige energiemix realiseert een significante emissiereductie 
              met behoud van kostenefficiëntie. Het hoge percentage duurzame bronnen draagt bij aan langetermijn 
              duurzaamheidsdoelen en verminderde milieu-impact.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KasDuurzaamheidsDashboard;