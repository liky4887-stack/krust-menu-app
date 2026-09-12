import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Send, Search, Phone, Video, MoreVertical } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/constants/colors';

interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

interface ChatThread {
  id: string;
  name: string;
  subtitle: string;
  avatar: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
}

const threads: ChatThread[] = [
  { id: '1', name: 'كرست — الدعم', subtitle: 'متصل', avatar: '☕', unread: 2, lastMessage: 'مرحبًا بك في كرست! كيف نقدر نساعدك؟', lastTime: 'الآن' },
  { id: '2', name: 'فرع المزة', subtitle: 'يستقبل طلباتك', avatar: '🏪', unread: 0, lastMessage: 'طلبك جاهز للاستلام', lastTime: '١٠:٣٠' },
  { id: '3', name: 'عروض كرست', subtitle: 'إشعارات', avatar: '🎁', unread: 1, lastMessage: 'عرض خاص: اشترِ واحد واحصل على الثاني مجانًا', lastTime: '٩:١٥' },
  { id: '4', name: 'السائق أحمد', subtitle: 'في الطريق إليك', avatar: '🛵', unread: 0, lastMessage: 'وصلت إلى العنوان، بانتظارك', lastTime: '٨:٤٠' },
];

const initialMessages: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'm1', text: 'مرحبًا بك في كرست! 👋', fromMe: false, time: 'الآن' },
    { id: 'm2', text: 'كيف نقدر نساعدك اليوم؟', fromMe: false, time: 'الآن' },
  ],
  '2': [
    { id: 'm1', text: 'طلبك جاهز للاستلام من فرع المزة', fromMe: false, time: '١٠:٣٠' },
  ],
  '3': [
    { id: 'm1', text: 'عرض خاص لفترة محدودة: اشترِ واحدًا واحصل على الثاني مجانًا!', fromMe: false, time: '٩:١٥' },
  ],
  '4': [
    { id: 'm1', text: 'وصلت إلى العنوان، بانتظارك', fromMe: false, time: '٨:٤٠' },
  ],
};

export default function MessagesScreen() {
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const filteredThreads = threads.filter(t =>
    !searchQuery || t.name.includes(searchQuery) || t.lastMessage.includes(searchQuery)
  );

  useEffect(() => {
    if (activeThread && scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [activeThread, messages]);

  const sendMessage = () => {
    if (!inputText.trim() || !activeThread) return;
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      text: inputText.trim(),
      fromMe: true,
      time: 'الآن',
    };
    setMessages(prev => ({
      ...prev,
      [activeThread]: [...(prev[activeThread] ?? []), newMsg],
    }));
    setInputText('');
  };

  if (activeThread) {
    const thread = threads.find(t => t.id === activeThread)!;
    const chatMessages = messages[activeThread] ?? [];

    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setActiveThread(null)} style={styles.backBtn}>
            <Text style={styles.backArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.chatAvatar}>
            <Text style={styles.chatAvatarText}>{thread.avatar}</Text>
          </View>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderName}>{thread.name}</Text>
            <Text style={styles.chatHeaderStatus}>{thread.subtitle}</Text>
          </View>
          <TouchableOpacity style={styles.chatActionBtn}>
            <Phone size={20} color={Colors.PRIMARY} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatActionBtn}>
            <Video size={20} color={Colors.PRIMARY} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatActionBtn}>
            <MoreVertical size={20} color={Colors.DARK_GRAY} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {chatMessages.map((msg) => (
              <View
                key={msg.id}
                style={[styles.messageBubble, msg.fromMe ? styles.messageMe : styles.messageThem]}
              >
                <Text style={[styles.messageText, msg.fromMe ? styles.messageTextMe : styles.messageTextThem]}>
                  {msg.text}
                </Text>
                <Text style={[styles.messageTime, msg.fromMe ? styles.messageTimeMe : styles.messageTimeThem]}>
                  {msg.time}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputBar}>
            <TextInput
              style={styles.chatInput}
              placeholder="اكتب رسالة..."
              placeholderTextColor={Colors.DARK_GRAY}
              value={inputText}
              onChangeText={setInputText}
              textAlign="right"
              underlineColorAndroid="transparent"
              cursorColor={Colors.PRIMARY}
              selectionColor={Colors.PRIMARY}
              multiline
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} activeOpacity={0.7}>
              <Send size={20} color={Colors.WHITE} strokeWidth={2} />
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

      <View style={styles.searchContainer}>
        <Search size={18} color={Colors.DARK_GRAY} strokeWidth={2} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث في المحادثات..."
          placeholderTextColor={Colors.DARK_GRAY}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign="right"
          underlineColorAndroid="transparent"
          cursorColor={Colors.PRIMARY}
          selectionColor={Colors.PRIMARY}
        />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {filteredThreads.map((thread) => (
          <TouchableOpacity
            key={thread.id}
            style={styles.threadItem}
            onPress={() => setActiveThread(thread.id)}
            activeOpacity={0.7}
          >
            <View style={styles.threadAvatar}>
              <Text style={styles.threadAvatarText}>{thread.avatar}</Text>
            </View>
            <View style={styles.threadInfo}>
              <View style={styles.threadTopRow}>
                <Text style={styles.threadName} numberOfLines={1}>{thread.name}</Text>
                <Text style={styles.threadTime}>{thread.lastTime}</Text>
              </View>
              <View style={styles.threadBottomRow}>
                <Text style={styles.threadLastMessage} numberOfLines={1}>{thread.lastMessage}</Text>
                {thread.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{thread.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.SURFACE },
  header: {
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.PRIMARY },
  headerSubtitle: { fontSize: 14, color: Colors.DARK_GRAY, marginTop: 2 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: Radius.MD,
    marginHorizontal: Spacing.LG,
    marginVertical: Spacing.MD,
    paddingHorizontal: Spacing.MD,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
  },
  searchIcon: { marginRight: Spacing.SM },
  searchInput: { flex: 1, fontSize: 14, color: Colors.BLACK, textAlign: 'right' },
  container: { flex: 1 },
  threadItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    backgroundColor: Colors.WHITE,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  threadAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.MD,
  },
  threadAvatarText: { fontSize: 24 },
  threadInfo: { flex: 1 },
  threadTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  threadName: { fontSize: 16, fontWeight: '700', color: Colors.BLACK, flex: 1, textAlign: 'right' },
  threadTime: { fontSize: 11, color: Colors.DARK_GRAY, marginLeft: Spacing.SM },
  threadBottomRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  threadLastMessage: { fontSize: 13, color: Colors.DARK_GRAY, flex: 1, textAlign: 'right' },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: Spacing.SM,
  },
  unreadText: { color: Colors.WHITE, fontSize: 11, fontWeight: '700' },
  chatHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM + 2,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 32, color: Colors.PRIMARY, fontWeight: '300', lineHeight: 36 },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.SM,
  },
  chatAvatarText: { fontSize: 20 },
  chatHeaderInfo: { flex: 1 },
  chatHeaderName: { fontSize: 15, fontWeight: '700', color: Colors.BLACK, textAlign: 'right' },
  chatHeaderStatus: { fontSize: 11, color: Colors.EMERALD_600, textAlign: 'right' },
  chatActionBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.XS },
  chatScroll: { flex: 1, backgroundColor: Colors.SURFACE },
  chatScrollContent: { padding: Spacing.LG, gap: Spacing.SM },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: Radius.MD,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM + 2,
    marginBottom: Spacing.XS,
  },
  messageMe: {
    backgroundColor: Colors.PRIMARY,
    alignSelf: 'flex-start',
    borderBottomRightRadius: 4,
  },
  messageThem: {
    backgroundColor: Colors.WHITE,
    alignSelf: 'flex-end',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  messageText: { fontSize: 14, lineHeight: 20 },
  messageTextMe: { color: Colors.WHITE },
  messageTextThem: { color: Colors.BLACK },
  messageTime: { fontSize: 10, marginTop: 4 },
  messageTimeMe: { color: 'rgba(255,255,255,0.7)', textAlign: 'left' },
  messageTimeThem: { color: Colors.DARK_GRAY, textAlign: 'right' },
  inputBar: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
    gap: Spacing.SM,
  },
  chatInput: {
    flex: 1,
    backgroundColor: Colors.SURFACE,
    borderRadius: Radius.PILL,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM + 2,
    fontSize: 14,
    color: Colors.BLACK,
    textAlign: 'right',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
