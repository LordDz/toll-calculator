import type { VehicleType } from '@/api/queries/toll';

export type FeeCheckFormProps = {
  checkDateTime: string;
  checkVehicle: VehicleType;
  onCheckDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckVehicleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
