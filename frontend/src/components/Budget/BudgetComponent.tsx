'use client';

import { PieChart } from 'react-minimal-pie-chart';
import { FC, useEffect, useState } from 'react';
import { IBudget } from '@/models/IBudget';
import { budgetService, tripService } from '@/services/api.services';
import { useForm } from 'react-hook-form';
import { BudgetCategoryFormData, budgetCategorySchema } from '@/validator/validation';
import { zodResolver } from '@hookform/resolvers/zod';

interface IProps {
  id: string;
}

const baseHue = 200; // відтінок
const baseSaturation = 70; // Насиченість (від 0 до 100)
const startLightness = 30; // Початкова світлість
const step = 10; // Крок збільшення світлості


const BudgetComponent: FC<IProps> = ({ id }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<IBudget[]>([]);
  const [maxBudget, setMaxBudget] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);

  useEffect(() => {
    const fetchMaxBudget = async () => {
      try {
        const trip = await tripService.getTripById(id);
        setMaxBudget(Number(trip.maxBudget));
      } catch (error) {
        console.error('Failed to fetch max budget:', error);
      }
    };

    fetchMaxBudget();
  }, [id]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<BudgetCategoryFormData>({
    resolver: zodResolver(budgetCategorySchema),
  });

  const handleAddCategory = async (data: BudgetCategoryFormData) => {
    try {
      await budgetService.addCategory(id, data);
      const updatedCategories = await budgetService.getAllBudgetByTripId(id);
      setCategories(updatedCategories);
      setShowForm(false);
      reset();
    } catch (error) {
      console.error('Failed to add category:', error);
      setError('category', { type: 'manual', message: 'Failed to add category' });
    }
  };

  const handleUpdateCategory = async (categoryId: string, value: string) => {
    try {
      await budgetService.updateCategory(categoryId, { value });
      const updatedCategories = await budgetService.getAllBudgetByTripId(id);
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await budgetService.deleteCategory(categoryId);
      const updatedCategories = await budgetService.getAllBudgetByTripId(id);
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleMaxBudgetChange = async (value: string) => {
    try {
      await budgetService.assignMaxBudget(id, value);
      setMaxBudget(Number(value));
    } catch (e) {
      console.error('Failed to update max budget:', e);
    }
  };

  useEffect(() => {
    const allCategories = async () => {
      try {
        const fetchedCategories = await budgetService.getAllBudgetByTripId(id);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    allCategories();
  }, [id]);
  console.log(categories, 'categories');

  let chartCategories = categories.map((category) => ({
    title: category.category,
    value: Number(category.value),
  }))
    .map((category, index) => {
      const lightness = startLightness + (index * step);
      return {
        ...category,
        color: `hsl(${baseHue}, ${baseSaturation}%, ${lightness}%)`,
      };
    });

  const totalValue = chartCategories.reduce((acc, category) => acc + category.value, 0);
  const budgetLeft = maxBudget !== null ? maxBudget - totalValue : null;


  return (
    <div className="border-amber-950 border-4">
      <div className="border-blue-500 border-4 flex flex-row">
        <PieChart className="w-80 h-80 m-6"
                  data={chartCategories}
                  label={({ dataEntry }) => dataEntry.title}
                  labelStyle={{
                    fontSize: '4px',
                    fill: '#fff',
                  }}
                  radius={40}
                  onClick={(_, index) => {
                    setActiveIndex(index === activeIndex ? null : index);
                  }}
                  segmentsShift={(index) => (index === activeIndex ? 5 : 0)} // збільшує сегмент
                  animate

        />
        <div>

          {categories.map((category) => (
            <div key={category.id}>
              <span>{category.category}: </span>
              <input
                type="text"
                value={category.value}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setCategories(prev =>
                    prev.map(categ => categ.id === category.id ? { ...categ, value: newValue } : categ),
                  );
                  setEditingCategoryId(category.id!);
                }}
              />
              <button onClick={() => handleDeleteCategory(category.id!)}>Delete</button>
              {editingCategoryId === category.id && (
                <button onClick={() => {
                  handleUpdateCategory(category.id!, category.value);
                  setEditingCategoryId(null);
                }}>
                  Save
                </button>
              )}
            </div>
          ))}

          {showForm ? (<div>
              <form onSubmit={handleSubmit(handleAddCategory)}>
                <input type={'text'} {...register('category', { required: true })} placeholder={'Enter the category'} />
                {errors?.category && <span className="text-red-500">This field is required</span>}
                <br />
                <input className="input-no-spinner" type={'text'} {...register('value', { required: true })}
                       placeholder={'Enter the value'} />
                {errors?.value && <span className="text-red-500">This field is required</span>}

                <button type={'submit'}>Add category</button>
              </form>
            </div>) :
            (<button className="border-amber-400 border-4" onClick={() => setShowForm(true)}> add</button>)

          }
        </div>
      </div>
      <div className="border-amber-400 border-4 flex flex-row justify-between">
        <label>
          Max budget:
          <input
            type={'number'}
            className="input-no-spinner"
            value={maxBudget !== null ? maxBudget : 'Enter your budget'}
            onChange={async (event) => {
              const newValue = (event.target.value);
              setMaxBudget(+newValue);
              setIsEditingBudget(true);
            }}
          />
        </label>
        {
          isEditingBudget && (
            <button onClick={() => {
              handleMaxBudgetChange(String(maxBudget));
              setIsEditingBudget(false);
            }}>
              Save budget
            </button>
          )
        }
        {
          budgetLeft !== null && budgetLeft > 0 ? (
            <span className="text-green-500">
              Budget left: {budgetLeft}
            </span>
          ) : budgetLeft === 0 ? (
            <span className="text-yellow-500">
              Yor are on budget!
            </span>
          ) : (
            <span className="text-red-500">
              Budget exceeded by {Math.abs(budgetLeft!)}
            </span>
          )
        }
      </div>
    </div>
  );
};

export default BudgetComponent;
