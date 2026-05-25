"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardFooter, Select, SelectItem } from "@nextui-org/react";

// import { toast } from '@/components/ui/use-toast'

import { fetchSettings, updateSettings } from "@/lib/actions/settings.action";
import { rentalsSettingsValidationSchema } from "@/lib/validations/schemas";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

export function RentalsForm({ data }) {
  const { t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  try {
    data = JSON.parse(data);
  } catch (error) {}

  const form = useForm({
    resolver: zodResolver(rentalsSettingsValidationSchema),
    defaultValues: {
      extra_driver_price_type: data?.extra_driver_price_type || "",
      extra_driver_price_per_day: data?.extra_driver_price_per_day || "",
      vat_mode: data?.vat_mode || "included",
    },
  });

  async function onSubmit(values) {
    const success = await updateSettings(data?.users, values, pathname);
    if (success) {
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="form-container w-fit flex flex-col">
          <h3>{t("forms.extraDrivers")}</h3>
          <FormField
            control={form.control}
            name="extra_driver_price_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("forms.priceCalculation")}</FormLabel>

                <Select
                  className="form-input"
                  onChange={field.onChange}
                  defaultSelectedKeys={field.value ? [field.value] : undefined}
                  aria-label={t("forms.priceCalculation")}
                  labelPlacement="outside"
                  isRequired
                  size="md"
                >
                  <SelectItem key={"day"}>{t("forms.perDay")}</SelectItem>
                  <SelectItem key={"fix"}>{t("forms.fix")}</SelectItem>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="extra_driver_price_per_day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("forms.price")}</FormLabel>
                <FormControl>
                  <Input
                    className="form-input"
                    type="number"
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vat_mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("forms.vatTreatment")}</FormLabel>

                <Select
                  className="form-input"
                  onChange={field.onChange}
                  defaultSelectedKeys={field.value ? [field.value] : ["included"]}
                  aria-label={t("forms.vatTreatment")}
                  labelPlacement="outside"
                  isRequired
                  size="md"
                >
                  <SelectItem key={"included"}>{t("common.vatIncluded")}</SelectItem>
                  <SelectItem key={"excluded"}>{t("common.vatExcluded")}</SelectItem>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <CardFooter className="flex place-content-between">
            <Button type="submit" color="primary">
              {t("common.save")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
