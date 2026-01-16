'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    Mail,
    Shield,
    Loader2,
    Camera,
    Info
} from 'lucide-react';
import Image from 'next/image';
import {
    useGetStaffs,
    useCreateStaff,
    useUpdateStaff,
    useDeleteStaff
} from '@/services/hooks/business/hook';
import { StaffType } from '@/app/interfaces/business.type';
import { Toaster, toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Modal Component ---
const StaffModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isLoading
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: StaffType) => void;
    initialData?: StaffType;
    isLoading: boolean;
}) => {
    const [formData, setFormData] = useState<StaffType>({
        businessId: '1', // Defaulting to 1 as per requirement context
        name: '',
        email: '',
        password: '',
        avatar: '',
        isActive: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                businessId: '1',
                name: '',
                email: '',
                password: '',
                avatar: '',
                isActive: true,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">
                        {initialData ? 'Edit Staff Member' : 'Add New Staff'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <XCircle size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Avatar Upload Placeholder */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                {formData.avatar ? (
                                    <Image src={formData.avatar} alt="Avatar" width={96} height={96} className="object-cover w-full h-full" />
                                ) : (
                                    <Users className="w-10 h-10 text-slate-400" />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <TooltipProvider>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <label className="block text-sm font-medium text-slate-700">Full Name</label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="w-4 h-4 text-slate-400 cursor-help hover:text-blue-500 transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Enter the staff member's legal full name.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <label className="block text-sm font-medium text-slate-700">Email Address</label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="w-4 h-4 text-slate-400 cursor-help hover:text-blue-500 transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>This email will be used for login access.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {!initialData && (
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <label className="block text-sm font-medium text-slate-700">Password</label>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="w-4 h-4 text-slate-400 cursor-help hover:text-blue-500 transition-colors" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Set a secure temporary password for the staff member.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-slate-700">Account Status</span>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="w-4 h-4 text-slate-400 cursor-help hover:text-blue-500 transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Toggle to admit or revoke system access.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.isActive ? 'bg-blue-600' : 'bg-slate-300'}`} onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>
                                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">
                                        {formData.isActive ? 'Account is Active' : 'Account is Inactive'}
                                    </span>
                                </div>
                            </div>
                        </TooltipProvider>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(formData)}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all flex items-center gap-2"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {initialData ? 'Update StaffMember' : 'Create StaffMember'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// --- Main Component ---
const Staff = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffType | undefined>(undefined);

    // Queries & Mutations
    const { data: staffList, isLoading, refetch } = useGetStaffs();
    const createMutation = useCreateStaff();
    const updateMutation = useUpdateStaff();
    const deleteMutation = useDeleteStaff();

    const handleCreateOrUpdate = async (data: StaffType) => {
        try {
            if (editingStaff && editingStaff.id) {
                await updateMutation.mutateAsync({ id: editingStaff.id, staff: data });
                toast.success('Staff member updated successfully');
            } else {
                await createMutation.mutateAsync(data);
                toast.success('New staff member added successfully');
            }
            setIsModalOpen(false);
            setEditingStaff(undefined);
            refetch();
        } catch (error) {
            toast.error('Operation failed. Please try again.');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to remove this staff member?')) {
            try {
                await deleteMutation.mutateAsync(id);
                toast.success('Staff member removed');
                refetch();
            } catch (error) {
                toast.error('Failed to remove staff member');
            }
        }
    };

    const filteredStaff = staffList?.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <Toaster position="top-right" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Staff Management</h1>
                    <p className="text-slate-500 mt-1">Manage team access and permissions</p>
                </div>
                <button
                    onClick={() => { setEditingStaff(undefined); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-600/20 transition-all flex items-center gap-2 transform active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add New Staff
                </button>
            </div>

            {/* Stats/Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-slate-500 font-medium">Total Staff</div>
                        <div className="text-2xl font-black text-slate-900">{staffList?.length || 0}</div>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm flex items-center">
                    <div className="p-3">
                        <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Staff Grid */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredStaff?.map((staff, index) => (
                            <motion.div
                                key={staff.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className={`absolute top-0 left-0 w-full h-1 ${staff.isActive ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-slate-200'}`} />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-md">
                                                {staff.avatar ? (
                                                    <Image src={staff.avatar} alt={staff.name} width={56} height={56} className="object-cover w-full h-full" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-xl">
                                                        {staff.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${staff.isActive ? 'bg-green-500' : 'bg-slate-300'}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{staff.name}</h3>
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-0.5">
                                                <Shield className="w-3 h-3" />
                                                Staff Member
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span className="truncate">{staff.email}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-slate-50">
                                    <button
                                        onClick={() => { setEditingStaff(staff); setIsModalOpen(true); }}
                                        className="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => staff.id && handleDelete(staff.id)}
                                        className="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredStaff?.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No staff members found</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        Get started by adding your first team member to help manage your business.
                    </p>
                    <button
                        onClick={() => { setEditingStaff(undefined); setIsModalOpen(true); }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-600/30 transition-all"
                    >
                        Add Staff Member
                    </button>
                </div>
            )}

            {/* Modal */}
            <StaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateOrUpdate}
                initialData={editingStaff}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
};

export default Staff;
