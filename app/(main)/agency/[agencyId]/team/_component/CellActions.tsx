"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { TeamMemberProps } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import AlertModal from "@/components/modals/AlertModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import CustomModal from "@/components/modals/CustomModal";
import AccountDetails from "@/components/forms/AccountDetails";
import { Copy, MoreVertical, Edit, Trash } from "lucide-react";
import { getAuthUserRoleByEmail, removeUser } from "@/data/queries";
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

  const {
    data: authUserRole,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-auth-user-role", user],
    queryFn: async () => {
      const authUserRole = await getAuthUserRoleByEmail(
        user?.emailAddresses[0].emailAddress
      );

      return authUserRole;
    },
  });

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

  if (!data || !data.agency || !data.agency.id) {
    return null;
  }

  return (
    <>
      {update && !isLoading && !isError && (
        <CustomModal
          open={update}
          onOpenChange={() => setUpdate(false)}
          title="Edit User Details"
          subheading="You can change permissions only when the user has an owned subaccount"
        >
          <div className="h-[70vh]">
            <ScrollArea>
              <AccountDetails
                type="agency"
                id={data.agency.id}
                authUserRole={authUserRole}
                userData={{
                  id: data.id,
                  name: data.name,
                  email: data.email,
                  avatarUrl: data.avatarUrl,
                  role: data.role,
                  agencyId: data.agencyId,
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
