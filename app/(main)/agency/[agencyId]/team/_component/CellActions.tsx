"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import prismadb from "@/lib/prisma";
import { Role } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { TeamMemberProps } from "@/types";
import { useRouter } from "next/navigation";
import { getAuthUserRoleByEmail, removeUser } from "@/data/queries";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/AlertModal";
import UserDetails from "@/components/forms/UserDetails";
import { ScrollArea } from "@/components/ui/scroll-area";
import CustomModal from "@/components/modals/CustomModal";
import { Copy, MoreVertical, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  data: TeamMemberProps;
};

const CellActions = ({ data }: Props) => {
  const router = useRouter();

  const { user } = useUser();

  const [remove, setRemove] = useState(false);

  const [update, setUpdate] = useState(false);

  const [loading, setLoading] = useState(false);

  const [authUserRole, setAuthUserRole] = useState<Role | undefined>(undefined);

  useEffect(() => {
    const getAuthUserRole = async () => {
      const authUserRole = await getAuthUserRoleByEmail(
        user?.emailAddresses[0].emailAddress
      );

      setAuthUserRole(authUserRole);
    };

    getAuthUserRole();
  }, [user]);

  const removeUserHandler = async () => {
    setLoading(true);

    try {
      await removeUser(data.id);

      toast.success(
        "The user has been deleted from this agency they no longer have access to the agency"
      );

      setRemove(false);

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong! Unable to remove user.");
    } finally {
      setLoading(false);
    }
  };

  if (!data || !data.agency) {
    return null;
  }

  return (
    <>
      {update && (
        <CustomModal
          open={update}
          onOpenChange={() => setUpdate(false)}
          title="Edit User Details"
          subheading="You can change permissions only when the user has an owned subaccount"
        >
          <div className="h-[70vh]">
            <ScrollArea>
              <UserDetails
                type="agency"
                id={data.agency?.id || null}
                authUserRole={authUserRole}
                userData={{
                  name: data.name,
                  email: data.email,
                  avatarUrl: data.avatarUrl,
                  role: data.role,
                }}
                subAccounts={data.agency?.subAccounts}
                subAccountsPermissions={data.permissions}
                onClose={() => setUpdate(false)}
              />
            </ScrollArea>
          </div>
        </CustomModal>
      )}

      {remove && (
        <AlertModal
          isOpen={remove}
          onClose={() => setRemove(false)}
          onConfirm={removeUserHandler}
          loading={loading}
          description="This action cannot be undone. This will permanently delete the user and related data."
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>

            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(data.email)}
            disabled={loading}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Email
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setUpdate(true)} disabled={loading}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Details
          </DropdownMenuItem>

          {data.role !== "AGENCY_OWNER" && (
            <DropdownMenuItem
              onClick={() => setRemove(true)}
              disabled={loading}
            >
              <Trash className="w-4 h-4 mr-2" />
              Remove User
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellActions;
