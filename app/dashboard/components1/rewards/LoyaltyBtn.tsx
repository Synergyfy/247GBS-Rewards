import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import LoyaltyMenu from './LoyaltyMenu';
import { MdKeyboardArrowRight } from "react-icons/md";

export function LoyaltyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
      <div className="px-24 flex justify-end items-center">
      <p className="text-[#2D3DFF] font-bold text-xl cursor-pointer">
        Create a reward
        </p>
                  <MdKeyboardArrowRight className="text-[#2D3DFF] w-12 h-12 font-extrabold cursor-pointer" />
                </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create a reward</DialogTitle>
          <DialogDescription className="text-gray-600 mb-4">
            {
              'Create a loyalty program to reward your customers for their loyalty. You can create a program that rewards customers with points for every purchase they make.'
            }
          </DialogDescription>
        </DialogHeader>
        <LoyaltyMenu />
        <DialogFooter>
          <Button type="submit" className="px-4 py-2 mt-10 bg-transparent font-semibold text-[#2D3DFF] rounded shadow-none bg-white hover:bg-[#2D3DFF] hover:text-[#fff]">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
