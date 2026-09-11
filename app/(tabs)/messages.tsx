import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/constants/colors';

interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

interface Thread {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

const initialThreads: Thread[] = [
  {
    id: 'support',
    name: 'دعم العملاء',
    icon: 'headset-outline',
    iconColor: '#1A5DAB',
    iconBg: '#E8F1FB',
    lastMessage: 'كيف يمكننا مساعدتك اليوم؟',
    time: 'الآن',
    unread: 2,
    messages: [
      { id: 's1', text: 'مرحبًا بك في كرست! كيف يمكننا مساعدتك؟', fromMe: false, time: '9:30 ص' },
      { id: 's2', text: 'عندي استفسار عن الطلب', fromMe: true, time: '9:31 ص' },
      { id: 's3', text: 'تفضل، أنا في خدمتك', fromMe: false, time: '9:31 ص' },
      { id: 's4', text: 'كيف يمكنني تعديل عنوان التوصيل بعد الطلب؟', fromMe: true, time: '9:32 ص' },
      { id: 's5', text: 'يمكنك تعديل العنوان من صفحة الطلب قبل التأكيد، أو تواصل معنا مباشرة هنا', fromMe: false, time: '9:33 ص' },
    ],
  },
  {
    id: 'branch',
    name: 'فرع كرست - طرابلس',
    icon: 'storefront-outline',
    iconColor: '#059669',
    iconBg: '#E8F8EF',
    lastMessage: 'طلبك جاهز للاستلام!',
    time: 'قبل 5 د',
    unread: 1,
    messages: [
      { id: 'b1', text: 'تم استلام طلبك رقم #1024', fromMe: false, time: '8:45 ص' },
      { id: 'b2', text: 'شكرًا! متى يكون جاهزًا؟', fromMe: true, time: '8:46 ص' },
      { id: 'b3', text: 'سيكون جاهزًا خلال 15 دقيقة', fromMe: false, time: '8:47 ص' },
      { id: 'b4', text: 'طلبك جاهز للاستلام!', fromMe: false, time: '8:50 ص' },
    ],
  },
  {
    id: 'offers',
    name: 'عروض كرست',
    icon: 'pricetag-outline',
    iconColor: '#F5A623',
    iconBg: '#FEF3E2',
    lastMessage: 'عرض خاص: اشترِ واحدًا واحصل على الثاني مجانًا',
    time: 'قبل ساعة',
    unread: 0,
    messages: [
      { id: 'o1', text: 'عرض خاص هذا الأسبوع!', fromMe: false, time: '7:00 ص' },
      { id: 'o2', text: 'اشترِ واحدًا واحصل على الثاني مجانًا على جميع المشروبات الساخنة', fromMe: false, time: '7:00 ص' },
      { id: 'o3', text: 'لفترة محدودة فقط', fromMe: false, time: '7:01 ص' },
    ],
  },
  {
    id: 'delivery',
    name: 'ال موصل',
    icon: 'bicycle-outline',
    iconColor: '#EF4444',
    iconBg: '#FEF2F2',
    lastMessage: 'وصلت إلى عنوانك، الرجاء الخروج للاستلام',
    time: 'قبل 3 س',
    unread: 0,
    messages: [
      { id: 'd1', text: 'المندوب في الطريق إليك', fromMe: false, time: '6:00 ص' },
      { id: 'd2', text: 'العنوان: شارع الجمهورية، عمارة 12', fromMe: true, time: '6:01 ص' },
      { id: 'd3', text: 'تمام، أنا قريب منك', fromMe: false, time: '6:10 ص' },
      { id: 'd4', text: 'وصلت إلى عنوانك، الرجاء الخروج للاستلام', fromMe: false, time: '6:15 ص' },
    ],
  },
];

export default function MessagesScreen() {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  useEffect(() => {
    if (activeThread && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [activeThread?.messages.length]);

  const handleOpenThread = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, unread: 0 } : t
      )
    );
    setActiveThreadId(threadId);
  };

  const handleBack = () => {
    setActiveThreadId(null);
    setInputText('');
  };

  const handleSend = () => {
    if (!inputText.trim() || !activeThreadId) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: inputText.trim(),
      fromMe: true,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? {
              ...t,
              messages: [...t.messages, newMessage],
              lastMessage: newMessage.text,
              time: 'الآن',
            }
          : t
      )
    );
    setInputText('');
  };

  const renderThread = (thread: Thread) => (
    <TouchableOpacity
      key={thread.id}
      style={styles.threadCard}
      onPress={() => handleOpenThread(thread.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.threadAvatar, { backgroundColor: thread.iconBg }]}>
        <Ionicons name={thread.icon} size={24} color={thread.iconColor} />
      </View>
      <View style={styles.threadInfo}>
        <View style={styles.threadHeader}>
          <Text style={styles.threadName} numberOfLines={1}>{thread.name}</Text>
          <Text style={styles.threadTime}>{thread.time}</Text>
        </View>
        <View style={styles.threadBody}>
          <Text style={styles.threadPreview} numberOfLines={1}>{thread.lastMessage}</Text>
          {thread.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{thread.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = (msg: Message) => (
    <View
      key={msg.id}
      style={[
        styles.messageBubble,
        msg.fromMe ? styles.messageOutgoing : styles.messageIncoming,
      ]}
    >
      <Text style={msg.fromMe ? styles.messageTextOut : styles.messageTextIn}>
        {msg.text}
      </Text>
      <Text style={msg.fromMe ? styles.messageTimeOut : styles.messageTimeIn}>
        {msg.time}
      </Text>
    </View>
  );

  if (activeThread) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <Ionicons name="chevron-forward" size={24} color={Colors.BLACK} />
            </TouchableOpacity>
            <View style={[styles.chatAvatar, { backgroundColor: activeThread.iconBg }]}>
              <Ionicons name={activeThread.icon} size={20} color={activeThread.iconColor} />
            </View>
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderName} numberOfLines={1}>{activeThread.name}</Text>
              <Text style={styles.chatHeaderStatus}>متصل الآن</Text>
            </View>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.chatBody}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatContent}
          >
            {activeThread.messages.map((msg) => renderMessage(msg))}
          </ScrollView>

          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="اكتب رسالة..."
              placeholderTextColor={Colors.DARK_GRAY}
              value={inputText}
              onChangeText={setInputText}
              textAlign="right"
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim()}
              activeOpacity={0.7}
            >
              <Ionicons name="send" size={20} color={inputText.trim() ? Colors.WHITE : Colors.DARK_GRAY} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الرسائل</Text>
        <Text style={styles.headerSubtitle}>محادثاتك مع كرست</Text>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.threadsList}>
          {threads.map((thread) => renderThread(thread))}
        </View>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.SURFACE },
  header: { paddingHorizontal: Spacing.LG, paddingVertical: Spacing.MD, backgroundColor: Colors.WHITE, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.PRIMARY },
  headerSubtitle: { fontSize: 14, color: Colors.DARK_GRAY, marginTop: 2 },
  container: { flex: 1 },
  threadsList: { paddingHorizontal: Spacing.LG, paddingTop: Spacing.MD },
  threadCard: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: Colors.WHITE, borderRadius: Radius.CARD, borderWidth: 1, borderColor: Colors.BORDER, padding: Spacing.MD, marginBottom: Spacing.SM },
  threadAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.MD },
  threadInfo: { flex: 1 },
  threadHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  threadName: { fontSize: 15, fontWeight: '700', color: Colors.BLACK, flex: 1, textAlign: 'right' },
  threadTime: { fontSize: 11, color: Colors.DARK_GRAY, marginLeft: Spacing.SM },
  threadBody: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  threadPreview: { fontSize: 13, color: Colors.DARK_GRAY, flex: 1, textAlign: 'right' },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: Colors.RED_500, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, marginLeft: Spacing.SM },
  unreadText: { color: Colors.WHITE, fontSize: 10, fontWeight: '700' },
  chatHeader: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: Spacing.MD, paddingVertical: Spacing.SM, backgroundColor: Colors.WHITE, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  chatAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.SM },
  chatHeaderInfo: { flex: 1 },
  chatHeaderName: { fontSize: 16, fontWeight: '700', color: Colors.BLACK, textAlign: 'right' },
  chatHeaderStatus: { fontSize: 11, color: Colors.EMERALD_600, marginTop: 2, textAlign: 'right' },
  chatBody: { flex: 1, backgroundColor: Colors.SURFACE, paddingHorizontal: Spacing.LG, paddingTop: Spacing.MD, paddingBottom: Spacing.SM, flexDirection: 'column' },
  chatContent: { gap: Spacing.SM, paddingBottom: Spacing.MD },
  messageBubble: { maxWidth: '75%', borderRadius: Radius.MD, paddingHorizontal: Spacing.MD, paddingVertical: Spacing.SM + 2, marginBottom: 2 },
  messageOutgoing: { alignSelf: 'flex-start', backgroundColor: Colors.PRIMARY, borderBottomRightRadius: 4 },
  messageIncoming: { alignSelf: 'flex-end', backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.BORDER, borderBottomLeftRadius: 4 },
  messageTextOut: { fontSize: 14, color: Colors.WHITE, textAlign: 'right', lineHeight: 20 },
  messageTextIn: { fontSize: 14, color: Colors.BLACK, textAlign: 'right', lineHeight: 20 },
  messageTimeOut: { fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 4, textAlign: 'right' },
  messageTimeIn: { fontSize: 9, color: Colors.DARK_GRAY, marginTop: 4, textAlign: 'right' },
  inputBar: { flexDirection: 'row-reverse', alignItems: 'flex-end', paddingHorizontal: Spacing.LG, paddingVertical: Spacing.SM, backgroundColor: Colors.WHITE, borderTopWidth: 1, borderTopColor: Colors.BORDER, gap: Spacing.SM },
  textInput: { flex: 1, backgroundColor: Colors.SURFACE, borderRadius: Radius.PILL, paddingHorizontal: Spacing.MD, paddingVertical: Spacing.SM + 2, fontSize: 14, color: Colors.BLACK, textAlign: 'right', maxHeight: 100, borderWidth: 1, borderColor: Colors.BORDER },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.PRIMARY, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: Colors.LIGHT_GRAY },
  bottomPadding: { height: 120 },
});
