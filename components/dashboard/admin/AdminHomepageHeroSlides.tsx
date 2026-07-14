"use client";

import Image from "next/image";
import { useState } from "react";
import {
  useListAllHeroSlidesQuery,
  type HeroSlide,
} from "@/app/redux/services/heroSlideApi";
import { useAppSelector } from "@/app/redux/hooks";
import {
  AdminHomepageSectionHeader,
  AdminStatusBadge,
  AdminTableShell,
} from "./AdminHomepageSectionHeader";
import { HeroSlideFormModal } from "./forms/HeroSlideFormModal";

export function AdminHomepageHeroSlides() {
  const accessToken = useAppSelector((state) => state.admin.accessToken);
  const {
    data: slides = [],
    isLoading,
    isError,
    refetch,
  } = useListAllHeroSlidesQuery(undefined, {
    skip: !accessToken,
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);

  return (
    <div className="space-y-6">
      <AdminHomepageSectionHeader
        title="Hero Slider"
        description="Main carousel banners on homepage"
        addLabel="+ Add Slide"
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
      />

      <AdminTableShell>
        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-muted">Loading slides...</div>
        ) : isError ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">
            Hero slides load করতে সমস্যা হয়েছে।
          </div>
        ) : slides.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            কোনো slide নেই। Add Slide দিয়ে নতুন যোগ করুন।
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3">Preview</th>
                <th className="px-6 py-3">Title (BN)</th>
                <th className="px-6 py-3">Title (EN)</th>
                <th className="px-6 py-3">CTA</th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) => (
                <tr
                  key={slide.id}
                  className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                >
                  <td className="px-6 py-4">
                    <div className="relative h-14 w-24 overflow-hidden rounded-lg bg-brand-gray">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.titleBn}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </td>
                  <td className="max-w-[200px] px-6 py-4 font-semibold text-foreground">
                    <p className="line-clamp-2">{slide.titleBn}</p>
                  </td>
                  <td className="max-w-[200px] px-6 py-4 text-muted">
                    <p className="line-clamp-2">{slide.titleEn}</p>
                  </td>
                  <td className="px-6 py-4 text-muted">{slide.ctaBn}</td>
                  <td className="px-6 py-4 text-muted">{slide.sortOrder}</td>
                  <td className="px-6 py-4">
                    <AdminStatusBadge isActive={slide.isActive} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(slide);
                        setOpen(true);
                      }}
                      className="text-sm font-semibold text-brand-green hover:text-brand-orange"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminTableShell>

      <HeroSlideFormModal
        open={open}
        initial={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSuccess={() => void refetch()}
      />
    </div>
  );
}
