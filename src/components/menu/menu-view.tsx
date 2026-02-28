"use client";

import { ClassicTemplate } from "./templates/classic";
import { ProfessionalTemplate } from "./templates/professional";
import { PremiumTemplate } from "./templates/premium";
import { GridTemplate } from "./templates/grid";
import { AccordionTemplate } from "./templates/accordion";
import { CafeTemplate } from "./templates/cafe";
import { BarTemplate } from "./templates/bar";
import { BreakfastTemplate } from "./templates/breakfast";
import { ItalianTemplate } from "./templates/italian";
import { SushiTemplate } from "./templates/sushi";
import { BurgerTemplate } from "./templates/burger";
import type { MenuTemplateProps } from "./menu-shared";

const TEMPLATES: Record<string, React.ComponentType<MenuTemplateProps>> = {
  classic: ClassicTemplate,
  professional: ProfessionalTemplate,
  premium: PremiumTemplate,
  grid: GridTemplate,
  accordion: AccordionTemplate,
  cafe: CafeTemplate,
  bar: BarTemplate,
  breakfast: BreakfastTemplate,
  italian: ItalianTemplate,
  sushi: SushiTemplate,
  burger: BurgerTemplate,
};

export function MenuView({ data, slug }: MenuTemplateProps) {
  const templateKey = data.business.menuTemplate ?? "classic";
  const Template = TEMPLATES[templateKey] ?? ClassicTemplate;

  return <Template data={data} slug={slug} />;
}
