"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createOfferingSchema,
  type CreateOfferingSchema,
  type CreateOfferingInput,
} from "@/lib/validations/offerings";
import { motion } from "motion/react";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { GuitarIcon, ImagePlus, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import React, { useEffect, useRef, useState } from "react";
import { Offering } from "./manage-offerings";

type CreateOfferingFormProps = {
  offering?: Offering;
  onSuccess?: () => void;
};

export function CreateOfferingForm({
  offering,
  onSuccess,
}: CreateOfferingFormProps) {
  const isEditing = !!offering;

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateOfferingInput, unknown, CreateOfferingSchema>({
    resolver: zodResolver(createOfferingSchema),
    defaultValues: {
      title: offering?.title ?? "",
      shortDescription: offering?.shortDescription ?? "",
      description: offering?.description ?? "",
      durationText: offering?.durationText ?? "",
      registrationInfo: offering?.registrationInfo ?? "",
      youtubeVideoUrl: offering?.youtubeVideoId
        ? `https://www.youtube.com/watch?v=${offering.youtubeVideoId}`
        : "",
      price: offering?.price != null ? String(offering.price) : "",
      discountPercent:
        offering?.discountPercent != null
          ? String(offering.discountPercent)
          : "",
    },
  });

  useEffect(() => {
    form.reset({
      title: offering?.title ?? "",
      shortDescription: offering?.shortDescription ?? "",
      description: offering?.description ?? "",
      durationText: offering?.durationText ?? "",
      registrationInfo: offering?.registrationInfo ?? "",
      youtubeVideoUrl: offering?.youtubeVideoId
        ? `https://www.youtube.com/watch?v=${offering.youtubeVideoId}`
        : "",
      price: offering?.price != null ? String(offering.price) : "",
      discountPercent:
        offering?.discountPercent != null
          ? String(offering.discountPercent)
          : "",
    });

    setSelectedImage(null);
    setImageError(null);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, [offering, form]);

  async function onSubmit(values: CreateOfferingSchema) {
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!isEditing && !selectedImage) {
      setImageError("انتخاب پوستر برای دوره الزامی است");
      return;
    }

    setImageError(null);

    try {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("shortDescription", values.shortDescription);
      formData.append("description", values.description);
      formData.append("durationText", values.durationText ?? "");
      formData.append("registrationInfo", values.registrationInfo ?? "");
      formData.append("youtubeVideoUrl", values.youtubeVideoUrl ?? "");

      formData.append(
        "price",
        values.price === undefined ? "" : String(values.price),
      );

      formData.append(
        "discountPercent",
        values.discountPercent === undefined
          ? ""
          : String(values.discountPercent),
      );
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const url = isEditing
        ? `/api/offerings/${offering.id}`
        : "/api/offerings";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            (isEditing ? "خطا در ویرایش دوره" : "خطا در ثبت دوره"),
        );
      }
      setSubmitSuccess(true);

      if (!isEditing) {
        form.reset();
        removeImage();
      }
      onSuccess?.();
    } catch (error) {
      console.error("Offering submission error:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "مشکلی در ذخیره اطلاعات دوره رخ داده است.",
      );
    }
  }

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setImageError("فرمت عکس باید JPEG یا PNG و یا WebP باشد");
      setSelectedImage(null);
      event.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setImageError("حجم فایل باید کمتر از ۵ مگابایت باشد");
      setSelectedImage(null);
      event.target.value = "";
      return;
    }

    setImageError(null);
    setSelectedImage(file);
  }

  function removeImage() {
    setSelectedImage(null);
    setImageError(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  return (
    <motion.div
      layout
      dir="rtl"
      className="bg-container-background xl:w-[90%] 2xl:w-[80%] max-w-[1800px] p-2 md:p-6 mt-6 mx-auto rounded-3xl md:rounded-4xl flex flex-col shadow-2xl"
    >
      <div className="flex justify-center items-end gap-4">
        <GuitarIcon size={86} className="text-light5 -translate-y-1/8" />
        <h1 className="lg:text-6xl text-light5 my-6">
          {isEditing ? "ویرایش دوره" : "ایجاد یک دوره جدید"}
        </h1>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="lg:p-6">
        <div className="grid grid-cols-2 gap-4 gap-x-8">
          <Field data-invalid={!!form.formState.errors.title}>
            <FieldLabel
              htmlFor="title"
              className="lg:text-4xl text-light5 lg:mr-2"
            >
              عنوان
            </FieldLabel>
            <Input
              id="title"
              placeholder="دوره گیتارالکتریک مبتدی"
              aria-invalid={!!form.formState.errors.title}
              {...form.register("title")}
              className="bg-container-background2 lg:rounded-2xl border-none text-light4 lg:text-xl lg:p-4 lg:h-16"
            />
            <FieldError errors={[form.formState.errors.title]}></FieldError>
          </Field>
          <Field data-invalid={!!form.formState.errors.durationText}>
            <FieldLabel
              htmlFor="durationText"
              className="lg:text-4xl text-light5 lg:mr-2"
            >
              مدت زمان
            </FieldLabel>
            <Input
              id="durationText"
              placeholder="۳۰۰ دقیقه"
              aria-invalid={!!form.formState.errors.durationText}
              {...form.register("durationText")}
              className="bg-container-background2 lg:rounded-2xl border-none text-light4 lg:text-xl lg:p-4 lg:h-16"
            />
            <FieldError
              errors={[form.formState.errors.durationText]}
            ></FieldError>
          </Field>
          <Field data-invalid={!!form.formState.errors.shortDescription}>
            <FieldLabel
              htmlFor="shortDescription"
              className="lg:text-4xl text-light5 lg:mr-2"
            >
              معرفی دوره
            </FieldLabel>
            <Textarea
              id="shortDescription"
              placeholder="دوره دوره شامل..."
              aria-invalid={!!form.formState.errors.shortDescription}
              {...form.register("shortDescription")}
              className="bg-container-background2 lg:rounded-2xl border-none text-light4 lg:text-xl lg:p-4 lg:h-36"
            />
            <FieldError
              errors={[form.formState.errors.shortDescription]}
            ></FieldError>
          </Field>

          <Field
            className=" row-span-2"
            data-invalid={!!form.formState.errors.description}
          >
            <FieldLabel
              htmlFor="description"
              className="lg:text-4xl text-light5 lg:mr-2"
            >
              توضیحات
            </FieldLabel>
            <Textarea
              id="description"
              placeholder="در دوره شما میتونید ..."
              aria-invalid={!!form.formState.errors.description}
              {...form.register("description")}
              className="bg-container-background2 lg:rounded-2xl border-none text-light4 lg:text-xl lg:p-4 lg:h-full"
            />
            <FieldError
              errors={[form.formState.errors.description]}
            ></FieldError>
          </Field>
          <Field data-invalid={!!form.formState.errors.registrationInfo}>
            <FieldLabel
              htmlFor="registrationInfo"
              className="lg:text-4xl text-light5 lg:mr-2"
            >
              اطلاعات ثبتنام
            </FieldLabel>
            <Textarea
              id="registrationInfo"
              placeholder="برای ثبتنام میتونید با مراجعه به..."
              aria-invalid={!!form.formState.errors.registrationInfo}
              {...form.register("registrationInfo")}
              className="bg-container-background2 lg:rounded-2xl border-none text-light4 lg:text-xl lg:p-4 lg:h-36"
            />
            <FieldError
              errors={[form.formState.errors.registrationInfo]}
            ></FieldError>
          </Field>
          <Field data-invalid={!!form.formState.errors.youtubeVideoUrl}>
            <FieldLabel
              htmlFor="youtubeVideoUrl"
              className="lg:text-4xl text-light5 lg:mr-2"
            >
              لینک ویدیو تیزر در یوتوب (اختیاری)
            </FieldLabel>
            <Input
              id="youtubeVideoUrl"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              aria-invalid={!!form.formState.errors.youtubeVideoUrl}
              {...form.register("youtubeVideoUrl")}
              className="bg-container-background2 lg:rounded-2xl border-none text-light4 lg:text-xl lg:p-4 lg:h-16"
            />
            <FieldError
              errors={[form.formState.errors.youtubeVideoUrl]}
            ></FieldError>
          </Field>
          <div className="flex gap-8">
            <Field data-invalid={!!form.formState.errors.price}>
              <FieldLabel
                htmlFor="price"
                className="lg:text-4xl text-light5 lg:mr-2"
              >
                قیمت (تومان)
              </FieldLabel>
              <Input
                id="price"
                type="number"
                min="0"
                step="1"
                placeholder="۲۰۰۰۰۰۰"
                aria-invalid={!!form.formState.errors.price}
                {...form.register("price")}
                className="bg-container-background2 lg:rounded-2xl border-none text-light4 lg:text-xl lg:p-4 lg:h-16"
              />
              <FieldError errors={[form.formState.errors.price]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.discountPercent}>
              <FieldLabel
                htmlFor="discountPercent"
                className="lg:text-4xl text-light5 lg:mr-2"
              >
                تخفیف (درصد)
              </FieldLabel>
              <Input
                id="discountPercent"
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="۲۰"
                aria-invalid={!!form.formState.errors.discountPercent}
                {...form.register("discountPercent")}
                className="bg-container-background2 lg:rounded-2xl border-none text-light4 lg:text-xl lg:p-4 lg:h-16"
              />
              <FieldError errors={[form.formState.errors.discountPercent]} />
            </Field>
          </div>
        </div>
        <Field data-invalid={!!imageError} className="mt-6">
          <FieldLabel className="lg:text-4xl text-light5 lg:mr-2">
            پوستر دوره
          </FieldLabel>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
          {previewUrl || (isEditing && offering?.imageUrl) ? (
            <div className="relative flex flex-col items-center gap-4 p-4 rounded-2xl bg-container-background2">
              <img
                src={previewUrl ?? offering?.imageUrl}
                alt="پیش نمایش پوستر دوره"
                className="max-h-80 max-w-full rounded-2xl object-contain"
              />

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-2 bg-light4 text-container-background px-5 py-2 rounded-full"
                >
                  <ImagePlus size={18} />
                  جایگزینی تصویر
                </button>
                {selectedImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center gap-2 bg-container-background3 text-light4 px-5 py-2 rounded-full"
                  >
                    <X size={18} />
                    {isEditing ? "لغو جایگزینی" : "حذف تصویر"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="w-full min-h-48 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-light5/30 bg-container-background2 text-light4 hover:border-light5 transition-colors"
            >
              <ImagePlus size={48} />
              <span className="text-lg">برای انتخاب تصویر کلیک کنید</span>
              <span className="text-sm opacity-60">
                JPEG، PNG یا WebP — حداکثر ۵ مگابایت
              </span>
            </button>
          )}
          {imageError && (
            <p role="alert" className="text-destructive text-sm">
              {imageError}
            </p>
          )}
        </Field>
        {submitError && (
          <p role="alert" className="text-destructive text-center mt-4">
            {submitError}
          </p>
        )}

        {submitSuccess && (
          <p role="status" className="text-green-500 text-center mt-4">
            {isEditing
              ? "تغییرات دوره با موفقیت ذخیره شد."
              : "دوره با موفقیت ثبت شد."}
          </p>
        )}
        <div className="flex items-center justify-center lg:mt-6 gap-4">
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-light4 py-2 px-6 md:px-12 rounded-full transition-all duration-500 text-container-background text-lg md:text-2xl shadow-2xs hover:bg-container-background3 hover:text-light4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {form.formState.isSubmitting
              ? "در حال ذخیره..."
              : isEditing
                ? "ثبت تغییرات"
                : "ثبت"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
