# Action Stack - Database Schema

This file documents the SQL schema for the Action Stack project. This should be executed in your Supabase SQL editor to set up the necessary tables and policies.

## 1. Stacks Table

Organizes actions into user-defined lists.

```sql
CREATE TABLE stacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT name_length CHECK (char_length(name) > 0 AND char_length(name) <= 100)
);

-- Enable RLS
ALTER TABLE stacks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own stacks" ON stacks
    FOR ALL USING (auth.uid() = user_id);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE stacks;
```

## 2. Actions Table

The core building block of the application—a single todo item.

```sql
CREATE TABLE actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stack_id UUID REFERENCES stacks(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMT P Z DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Future-ready for Release 2 AI features
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_confidence FLOAT DEFAULT NULL,
    original_text TEXT DEFAULT NULL,

    -- Accessibility metadata
    accessibility_notes JSONB DEFAULT '{}',

    CONSTRAINT text_length CHECK (char_length(text) > 0)
);

-- Enable RLS
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own actions" ON actions
    FOR ALL USING (auth.uid() = user_id);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE actions;
```
