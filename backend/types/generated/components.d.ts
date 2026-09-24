import type { Schema, Struct } from '@strapi/strapi';

export interface BioHighlight extends Struct.ComponentSchema {
  collectionName: 'components_bio_highlights';
  info: {
    displayName: 'BioHighlight';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    icon: Schema.Attribute.String;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BioStat extends Struct.ComponentSchema {
  collectionName: 'components_bio_stats';
  info: {
    displayName: 'BioStat';
    icon: 'chart-bar';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'bio.highlight': BioHighlight;
      'bio.stat': BioStat;
    }
  }
}
