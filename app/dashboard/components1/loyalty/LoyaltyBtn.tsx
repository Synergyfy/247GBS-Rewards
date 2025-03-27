import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoyaltyMenu from "./LoyaltyMenu";
import { MdKeyboardArrowRight } from "react-icons/md";

export function LoyaltyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
      <div className="px-24 flex justify-end items-center">
          <p className="text-[#2D3DFF] font-bold text-xl cursor-pointer">
            Create a program
          </p>
          <MdKeyboardArrowRight className="text-[#2D3DFF] w-12 h-12 font-extrabold cursor-pointer" />
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[40rem]">
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-3xl">Create a program</h2>
          </DialogTitle>
          <DialogDescription>
            {
              "Create a loyalty program to reward your customers for their loyalty. You can create a program that rewards customers with points for every purchase they make."
            }
          </DialogDescription>
        </DialogHeader>
        <LoyaltyMenu />
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
