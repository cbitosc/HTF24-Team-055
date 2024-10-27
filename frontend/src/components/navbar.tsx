import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useCookies } from "react-cookie";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Select,  SelectItem } from "@nextui-org/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { Input, Textarea } from "@nextui-org/input";
import { useEffect, useState } from "react";

interface AddTaskButtonProps {
  onOpen: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onOpen }) => {
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [cookies] = useCookies(['token'])
  useEffect(() => {
    const token =  cookies.token;
    setHasToken(!!token);
  }, []);

  return (
    <>
      {hasToken ? (
        <Button
          onPress={onOpen}
          className="text-sm font-normal text-default-600 bg-default-100"
          variant="flat"
        >
          Add Task
        </Button>
      ) : (
        <Button
          as={Link}
          href="/login"
          className="text-sm font-normal text-default-600 bg-default-100"
          variant="flat"
        >
          Login
        </Button>
      )}
    </>
  );
};

export const Navbar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planned");
  async function sendTask(onClose: () => void){
    const taskData = {
      title,
      description,
      status,
    };

    try {
      const response = await fetch('http://localhost:3000/api/tasks/', {
        credentials:'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData), 
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setStatus("planned");
      } else {
        console.error('Error creating task:', response.statusText);
      }
      onClose();
      window.location.reload(); 
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo />
            <p className="font-bold text-inherit">Task Management</p>
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2"></div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <AddTaskButton onOpen={onOpen} />
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Modal Title
                  </ModalHeader>
                  <ModalBody>
                    <form action="">
                      <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                        isClearable
                        type="text"
                        label="Title"
                        variant="bordered"
                      />
                      <Textarea
                        label="Description"
                        placeholder="Enter your description"
                        className="max-w mt-5 mb-5"
                        variant="bordered"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <Select
                        label="Task Status"
                        placeholder="Select task status"
                        className="max-w-xs"
                        value={status}
                        onChange={(e)=>setStatus(e.target.value)}
                      >
                        <SelectItem key="planned">Planned</SelectItem>
                        <SelectItem key="ongoing">Ongoing</SelectItem>
                        <SelectItem key="completed">Completed</SelectItem>
                      </Select>
                    </form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" className="max-w" onPress={() => sendTask(onClose)}>
                      Submit
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
