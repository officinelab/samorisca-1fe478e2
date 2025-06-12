
import React from 'react';
import { Text } from '@react-pdf/renderer';
import { Category } from '@/types/database';

interface CategoryTitleProps {
  category: Category;
  language: string;
  style: any;
  visible: boolean;
}

const CategoryTitle: React.FC<CategoryTitleProps> = ({
  category,
  language,
  style,
  visible
}) => {
  const getCategoryTitle = () => {
    const titleKey = `title_${language}` as keyof Category;
    return (category[titleKey] as string) || category.title;
  };

  if (!visible) return null;

  return (
    <Text style={style}>
      {getCategoryTitle()}
    </Text>
  );
};

export default CategoryTitle;
