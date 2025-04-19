import { ITripStop } from '@/models/ITripStop';
import { FC, useState } from 'react';
import { TripStopUpdateFormData } from '@/validator/validation';
import PinModal from '@/components/Maps/PinModal';
import { useMap } from '@vis.gl/react-google-maps';

interface IProps {
  // tripId: string;
  tripStops: ITripStop[];
  onEditAction: (data: TripStopUpdateFormData) => void;
  onDeleteAction: (id: string) => void;
  selectedStop: ITripStop | null;
  setSelectedStop: (marker: ITripStop | null) => void;
}

const TripStopsComponent: FC<IProps> = ({ tripStops, onEditAction, onDeleteAction, setSelectedStop, selectedStop }) => {

  // const [tripStops, setTripStops] = useState<ITripStop[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const map = useMap();

  // useEffect(() => {
  //   tripService.getTripStops(tripId)
  //     .then((data) => {
  //       console.log("stops", data);
  //       setTripStops(Array.isArray(data) ? data : []);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching trip stops:", error);
  //       setTripStops([]);
  //     })
  //
  // }, [tripId]);

  const handleEditClick = (stop: ITripStop) => {
    setSelectedStop(stop);
    setModalOpen(true);
  };

  const handleModalSave = (updatedData: TripStopUpdateFormData) => {
    onEditAction(updatedData);
    setModalOpen(false);
  };

  const handleModalDelete = () => {
    if (selectedStop) {
      onDeleteAction(selectedStop.id);
      setModalOpen(false);
    }
  };


  const handleTitleClick = (stop: ITripStop) => {
    if (map && stop.lat && stop.lng) {
      map.panTo({ lat: Number(stop.lat), lng: Number(stop.lng) });
      setSelectedStop(stop);
    }
  };

  return (
      <div>
        <ul>
        {tripStops?.map((stop) => (
          <li key={stop.id}>
            <div>
              <h2
                onClick={() => handleTitleClick(stop)}
                style={{ cursor: 'pointer', color: 'hotpink' }}
              >{stop.key}</h2>
            </div>
            <div id={'edit-delete'}>
              <button onClick={() => handleEditClick(stop)}
              >edit</button>
              <button onClick={() => onDeleteAction(stop.id)}>delete</button>
            </div>
          </li>
        ))}
          </ul>

        <PinModal
          mode="edit"
          open={modalOpen}
          onOpenChangeAction={setModalOpen}
          initialData={selectedStop ?? undefined}
          onSaveAction={handleModalSave}
          onDeleteAction={handleModalDelete}
          textAreas={{
            title: 'Редагувати зупинку',
            description: 'Відредагуйте дані зупинки та збережіть зміни.',
            saveBtn: 'Зберегти',
            deleteBtn: 'Видалити',
          }}
        />


      </div>
  );
};
export default TripStopsComponent;