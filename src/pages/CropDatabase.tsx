import React, { useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import CropDatabaseUploader from '@/components/CropDatabaseUploader';
import { useCropDatabase } from '@/hooks/useCropDatabase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Leaf, Bug, Image, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CropDatabase: React.FC = () => {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { crops, diseases, loading, searchCrops, searchDiseases } = useCropDatabase();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<'crops' | 'diseases'>('crops');

  

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const results = searchType === 'crops' 
      ? await searchCrops(searchQuery)
      : await searchDiseases(searchQuery);
    
    setSearchResults(results);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Database className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading crop database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Database className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold">Crop Database</h1>
          <p className="text-muted-foreground">
            Comprehensive database of crops, diseases, and agricultural knowledge
          </p>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search Database</TabsTrigger>
            <TabsTrigger value="browse">Browse All</TabsTrigger>
            {isAdmin && <TabsTrigger value="upload">Upload Data</TabsTrigger>}
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search Interface */}
            <Card className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search crops, diseases, symptoms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={searchType === 'crops' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('crops')}
                >
                  <Leaf className="h-4 w-4 mr-2" />
                  Crops
                </Button>
                <Button
                  variant={searchType === 'diseases' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('diseases')}
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Diseases
                </Button>
              </div>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="grid gap-4">
                {searchResults.map((item) => (
                  <Card key={item.id} className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        {item.scientific_name && (
                          <p className="text-sm text-muted-foreground italic">
                            {item.scientific_name}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {item.category && (
                          <Badge variant="secondary">{item.category}</Badge>
                        )}
                        {item.severity && (
                          <Badge className={getSeverityColor(item.severity)}>
                            {item.severity}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="text-muted-foreground mb-3">{item.description}</p>
                    )}
                    
                    {item.symptoms && (
                      <div className="mb-3">
                        <h4 className="font-medium mb-1">Symptoms:</h4>
                        <p className="text-sm text-muted-foreground">{item.symptoms}</p>
                      </div>
                    )}
                    
                    {item.treatment && (
                      <div>
                        <h4 className="font-medium mb-1">Treatment:</h4>
                        <p className="text-sm text-muted-foreground">{item.treatment}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <div className="grid gap-6">
              {/* Crops Overview */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Leaf className="h-6 w-6 mr-2 text-green-600" />
                  Crops ({crops.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {crops.slice(0, 6).map((crop) => (
                    <Card key={crop.id} className="p-4">
                      <h3 className="font-semibold">{crop.name}</h3>
                      {crop.scientific_name && (
                        <p className="text-sm text-muted-foreground italic">
                          {crop.scientific_name}
                        </p>
                      )}
                      {crop.category && (
                        <Badge variant="secondary" className="mt-2">
                          {crop.category}
                        </Badge>
                      )}
                    </Card>
                  ))}
                </div>
                {crops.length > 6 && (
                  <p className="text-center text-muted-foreground mt-4">
                    And {crops.length - 6} more crops...
                  </p>
                )}
              </Card>

              {/* Diseases Overview */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Bug className="h-6 w-6 mr-2 text-red-600" />
                  Diseases ({diseases.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {diseases.slice(0, 6).map((disease) => (
                    <Card key={disease.id} className="p-4">
                      <h3 className="font-semibold">{disease.name}</h3>
                      {disease.scientific_name && (
                        <p className="text-sm text-muted-foreground italic">
                          {disease.scientific_name}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        {disease.severity && (
                          <Badge className={getSeverityColor(disease.severity)}>
                            {disease.severity}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
                {diseases.length > 6 && (
                  <p className="text-center text-muted-foreground mt-4">
                    And {diseases.length - 6} more diseases...
                  </p>
                )}
              </Card>
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="upload">
              <CropDatabaseUploader />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default CropDatabase;