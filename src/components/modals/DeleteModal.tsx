import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Store } from "@/context/Store";
import { useFetch } from "@/hooks/useFetch";
import { apiUrl } from "@/utils/apiUrl";
import { TrashIcon } from "@heroicons/react/16/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";

type Props = {
  onClick: any;
};

function DeleteModal({ onClick }: Props) {
  const [query, setQuery] = useState("");
  const url = `${apiUrl}/product/all/?keyword=${query}`;
  const response = useFetch(url);
  // @ts-ignore
  const { dispatch } = useContext(Store);

  const addItemToCart = (item: any) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <TrashIcon height={16} width={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete item?</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col items-center">
              <p className="text-red-600 font-semibold text-center text-lg py-8">
                Proceed to delete item indicated
              </p>
              <PrimaryButton onClick={onClick} text="Confirm delete" />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteModal;
