import { create } from 'zustand';

export const useStore = create((set) => ({

    isModalFunc: false,
    setModalFuncActive: () => set({ isModalFunc: true }),
    setModalFuncInActive: () => set({ isModalFunc: false }),

    isModalText: '',
    setModalText: (text) => set({ isModalText: text }),

    isModalOpen: false,
    setModalOpen: () => set({ isModalOpen: true }),
    setModalClose: () => set({ isModalOpen: false }),
}));