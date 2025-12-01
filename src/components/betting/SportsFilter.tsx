
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Trophy, Dribbble } from 'lucide-react';

interface SportsFilterProps {
  selectedSports: string[];
  onValueChange: (value: string[]) => void;
}

const SportsFilter = ({ selectedSports, onValueChange }: SportsFilterProps) => {
  return (
    <ToggleGroup 
      type="multiple" 
      value={selectedSports} 
      onValueChange={onValueChange} 
      className="justify-start mt-2 sm:mt-0"
    >
      <ToggleGroupItem value="NFL" aria-label="Toggle NFL">
        <Trophy className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">NFL</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="NBA" aria-label="Toggle NBA">
        <Dribbble className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">NBA</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default SportsFilter;
