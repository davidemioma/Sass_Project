import Link from "next/link";
import Image from "next/image";
import prismadb from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CheckCircleIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function LaunchPadPage({
  params: { subaccountId },
  searchParams: { state, code },
}: {
  params: { subaccountId: string };
  searchParams: {
    state: string;
    code: string;
  };
}) {
  const subAccountDetails = await prismadb.subAccount.findUnique({
    where: { id: subaccountId },
  });

  if (!subAccountDetails) {
    return redirect("/");
  }

  const allDetailsExist =
    subAccountDetails.address &&
    subAccountDetails.subAccountLogo &&
    subAccountDetails.city &&
    subAccountDetails.companyEmail &&
    subAccountDetails.companyPhone &&
    subAccountDetails.country &&
    subAccountDetails.name &&
    subAccountDetails.state &&
    subAccountDetails.zipCode;

  let connectedStripeAccount = false;

  return (
    <div className="w-full max-w-[800px] mx-auto h-full flex items-center justify-center">
      <Card className="border-none">
        <CardHeader>
          <CardTitle>Lets get started!</CardTitle>

          <CardDescription>
            Follow the steps below to get your account setup.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="w-full flex items-center justify-between gap-4 p-4 border rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Image
                className="rounded-md object-contain"
                src="/assets/appstore.png"
                height={80}
                width={80}
                alt="app logo"
              />

              <p className="text-sm">
                Save the website as a shortcut on your mobile device
              </p>
            </div>

            <CheckCircleIcon
              className=" text-primary p-2 flex-shrink-0"
              size={50}
            />
          </div>

          <div className="w-full flex items-center justify-between gap-4 p-4 border rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Image
                className="rounded-md object-contain"
                src="/assets/stripelogo.png"
                height={80}
                width={80}
                alt="app logo"
              />

              <p className="text-sm">
                Connect your stripe account to accept payments and see your
                dashboard.
              </p>
            </div>

            {subAccountDetails.connectAccountId || connectedStripeAccount ? (
              <CheckCircleIcon
                className=" text-primary p-2 flex-shrink-0"
                size={50}
              />
            ) : (
              <Link
                className="bg-primary py-2 px-4 rounded-md text-white"
                href={""}
              >
                Start
              </Link>
            )}
          </div>

          <div className="w-full flex items-center justify-between gap-4 p-4 border rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Image
                className="rounded-md object-contain"
                src={subAccountDetails.subAccountLogo}
                height={80}
                width={80}
                alt="app logo"
              />

              <p className="text-sm">Fill in all your bussiness details.</p>
            </div>

            {allDetailsExist ? (
              <CheckCircleIcon
                className="text-primary p-2 flex-shrink-0"
                size={50}
              />
            ) : (
              <Link
                className="bg-primary py-2 px-4 rounded-md text-white"
                href={`/subaccount/${subAccountDetails.id}/settings`}
              >
                Start
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
